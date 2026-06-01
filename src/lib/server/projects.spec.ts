import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import {
	createProject,
	discoverProjects,
	normalizeGithubUrl,
	ProjectValidationError
} from './projects';

const temporaryRoots: string[] = [];

async function createTemporaryRoot() {
	const root = await mkdtemp(join(tmpdir(), 'bright-desk-projects-'));
	temporaryRoots.push(root);
	return root;
}

afterEach(async () => {
	await Promise.all(
		temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	);
});

describe('project discovery', () => {
	it('discovers immediate child project directories with known markers', async () => {
		expect.assertions(3);
		const workspace = await createTemporaryRoot();
		await mkdir(join(workspace, 'bright-desk'));
		await mkdir(join(workspace, 'not-a-project'));
		await writeFile(
			join(workspace, 'bright-desk', 'project.yaml'),
			[
				'schema_version: 1',
				'id: bright-desk',
				'name: Bright Desk',
				'github:',
				'  url: https://github.com/Thanhphan1147/bright-desk'
			].join('\n')
		);

		const projects = await discoverProjects(workspace);

		expect(projects).toHaveLength(1);
		expect(projects[0].name).toBe('Bright Desk');
		expect(projects[0].githubUrl).toBe('https://github.com/Thanhphan1147/bright-desk');
	});

	it('surfaces invalid project YAML as a project-level error', async () => {
		expect.assertions(2);
		const workspace = await createTemporaryRoot();
		await mkdir(join(workspace, 'broken'));
		await writeFile(join(workspace, 'broken', 'tasks.yaml'), 'tasks: [');

		const projects = await discoverProjects(workspace);

		expect(projects).toHaveLength(1);
		expect(projects[0].error).toContain('Invalid');
	});
});

describe('project creation', () => {
	it('creates initial project YAML files with normalized GitHub URL', async () => {
		expect.assertions(8);
		const workspace = await createTemporaryRoot();

		const project = await createProject(workspace, {
			name: 'Bright Desk',
			githubUrl: 'github.com/Thanhphan1147/bright-desk.git'
		});

		expect(project.id).toBe('bright-desk');
		expect(project.githubUrl).toBe('https://github.com/Thanhphan1147/bright-desk');
		await expect(readFile(join(workspace, 'bright-desk', 'tasks.yaml'), 'utf8')).resolves.toContain(
			'tasks: []'
		);
		await expect(
			readFile(join(workspace, 'bright-desk', 'pending_decisions.yaml'), 'utf8')
		).resolves.toContain('decisions: []');
		await expect(
			readFile(join(workspace, 'bright-desk', 'completed_tasks.yaml'), 'utf8')
		).resolves.toContain('completed_tasks: []');

		const projectYaml = parse(
			await readFile(join(workspace, 'bright-desk', 'project.yaml'), 'utf8')
		);
		expect(projectYaml.github.url).toBe('https://github.com/Thanhphan1147/bright-desk');
		expect(projectYaml.schema_version).toBe(1);
		expect(projectYaml.agent_instructions.primary_context_files).toEqual([]);
	});

	it('rejects duplicate project IDs', async () => {
		expect.assertions(1);
		const workspace = await createTemporaryRoot();

		await createProject(workspace, {
			name: 'Bright Desk',
			githubUrl: 'https://github.com/Thanhphan1147/bright-desk'
		});

		await expect(
			createProject(workspace, {
				name: 'Bright Desk!',
				githubUrl: 'https://github.com/Thanhphan1147/bright-desk'
			})
		).rejects.toBeInstanceOf(ProjectValidationError);
	});
});

describe('normalizeGithubUrl', () => {
	it('normalizes GitHub repository URLs', () => {
		expect(normalizeGithubUrl('github.com/owner/repo.git')).toBe('https://github.com/owner/repo');
	});

	it('rejects SSH URLs', () => {
		expect(() => normalizeGithubUrl('git@github.com:owner/repo.git')).toThrow(
			ProjectValidationError
		);
	});
});
