import { mkdir, readdir, stat } from 'node:fs/promises';
import { basename } from 'node:path';

import { resolveWorkspacePath } from './workspace';
import {
	completedTasksFileSchema,
	decisionsFileSchema,
	githubUrlSchema,
	projectSchema,
	tasksFileSchema,
	type ProjectFile
} from './yaml/schema';
import { readVersionedYaml, writeYamlAtomic } from './yaml/repository';

const PROJECT_MARKERS = [
	'project.yaml',
	'tasks.yaml',
	'pending_decisions.yaml',
	'completed_tasks.yaml',
	'context'
] as const;

export type ProjectSummary = {
	id: string;
	name: string;
	path: string;
	githubUrl?: string;
	activeTasks: number;
	pendingDecisions: number;
	completedTasks: number;
	error?: string;
};

export type CreateProjectInput = {
	name: string;
	githubUrl: string;
};

export async function discoverProjects(workspacePath: string): Promise<ProjectSummary[]> {
	const entries = await readdir(workspacePath, { withFileTypes: true });
	const directories = entries
		.filter((entry) => entry.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));
	const projects = await Promise.all(
		directories.map(async (entry) => {
			const projectPath = resolveWorkspacePath(workspacePath, entry.name);

			if (!(await isProjectDirectory(projectPath))) {
				return undefined;
			}

			return readProjectSummary(projectPath, entry.name);
		})
	);

	return projects.filter((project): project is ProjectSummary => project !== undefined);
}

export async function createProject(
	workspacePath: string,
	input: CreateProjectInput,
	now = new Date()
): Promise<ProjectSummary> {
	const name = input.name.trim();
	const githubUrl = normalizeGithubUrl(input.githubUrl);
	const id = slugifyProjectId(name);
	const projectPath = resolveWorkspacePath(workspacePath, id);

	if (!name) {
		throw new ProjectValidationError('Project name is required.');
	}

	if (await pathExists(projectPath)) {
		throw new ProjectValidationError(`Project '${id}' already exists.`);
	}

	const timestamp = now.toISOString();
	await mkdir(projectPath, { recursive: true });
	await mkdir(resolveWorkspacePath(workspacePath, id, 'context'), { recursive: true });

	const project: ProjectFile = {
		schema_version: 1,
		id,
		name,
		status: 'active',
		github: { url: githubUrl },
		created_at: timestamp,
		updated_at: timestamp,
		agent_instructions: { primary_context_files: [] }
	};

	await writeYamlAtomic(
		resolveWorkspacePath(workspacePath, id, 'project.yaml'),
		project,
		projectSchema
	);
	await writeYamlAtomic(
		resolveWorkspacePath(workspacePath, id, 'tasks.yaml'),
		{ schema_version: 1, tasks: [] },
		tasksFileSchema
	);
	await writeYamlAtomic(
		resolveWorkspacePath(workspacePath, id, 'pending_decisions.yaml'),
		{ schema_version: 1, decisions: [] },
		decisionsFileSchema
	);
	await writeYamlAtomic(
		resolveWorkspacePath(workspacePath, id, 'completed_tasks.yaml'),
		{ schema_version: 1, completed_tasks: [] },
		completedTasksFileSchema
	);

	return readProjectSummary(projectPath, id);
}

export function normalizeGithubUrl(rawUrl: string): string {
	const trimmedUrl = rawUrl.trim().replace(/\.git$/, '');
	const shorthandMatch = /^(?:https?:\/\/)?github\.com\/([^/\s]+)\/([^/\s]+)$/.exec(trimmedUrl);

	if (!shorthandMatch) {
		throw new ProjectValidationError(
			'GitHub repository URL must be https://github.com/{owner}/{repo}.'
		);
	}

	const normalizedUrl = `https://github.com/${shorthandMatch[1]}/${shorthandMatch[2]}`;
	const result = githubUrlSchema.safeParse(normalizedUrl);

	if (!result.success) {
		throw new ProjectValidationError(
			'GitHub repository URL must be https://github.com/{owner}/{repo}.'
		);
	}

	return result.data;
}

export class ProjectValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ProjectValidationError';
	}
}

async function readProjectSummary(
	projectPath: string,
	fallbackId: string
): Promise<ProjectSummary> {
	const id = basename(projectPath);

	try {
		const [project, tasks, decisions, completedTasks] = await Promise.all([
			readOptionalYaml(`${projectPath}/project.yaml`, projectSchema),
			readOptionalYaml(`${projectPath}/tasks.yaml`, tasksFileSchema),
			readOptionalYaml(`${projectPath}/pending_decisions.yaml`, decisionsFileSchema),
			readOptionalYaml(`${projectPath}/completed_tasks.yaml`, completedTasksFileSchema)
		]);

		return {
			id: project?.id ?? fallbackId,
			name: project?.name ?? fallbackId,
			path: projectPath,
			githubUrl: project?.github.url,
			activeTasks: tasks?.tasks.filter((task) => task.status !== 'completed').length ?? 0,
			pendingDecisions:
				decisions?.decisions.filter((decision) => decision.status === 'pending').length ?? 0,
			completedTasks: completedTasks?.completed_tasks.length ?? 0
		};
	} catch (error) {
		return {
			id,
			name: fallbackId,
			path: projectPath,
			activeTasks: 0,
			pendingDecisions: 0,
			completedTasks: 0,
			error: error instanceof Error ? error.message : 'Project could not be read.'
		};
	}
}

async function readOptionalYaml<T>(
	filePath: string,
	schema: Parameters<typeof readVersionedYaml<T>>[1]
) {
	if (!(await pathExists(filePath))) {
		return undefined;
	}

	return (await readVersionedYaml(filePath, schema)).data;
}

async function isProjectDirectory(projectPath: string) {
	const markerChecks = await Promise.all(
		PROJECT_MARKERS.map((marker) => pathExists(`${projectPath}/${marker}`))
	);
	return markerChecks.some(Boolean);
}

async function pathExists(path: string) {
	try {
		await stat(path);
		return true;
	} catch (error) {
		const code = error instanceof Error && 'code' in error ? error.code : undefined;

		if (code === 'ENOENT' || code === 'ENOTDIR') {
			return false;
		}

		throw error;
	}
}

function slugifyProjectId(name: string) {
	const slug = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

	if (!slug) {
		throw new ProjectValidationError('Project name must contain letters or numbers.');
	}

	return slug;
}
