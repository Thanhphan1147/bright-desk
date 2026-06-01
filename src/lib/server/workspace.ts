import { constants } from 'node:fs';
import { access, readdir, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';

const WORKSPACE_ENV = 'BRIGHT_DESK_WORKSPACE';

export type WorkspaceStatus =
	| {
			status: 'ready';
			path: string;
	  }
	| {
			status: 'missing';
			variable: typeof WORKSPACE_ENV;
			message: string;
	  }
	| {
			status: 'invalid';
			path: string;
			message: string;
	  }
	| {
			status: 'inaccessible';
			path: string;
			message: string;
	  };

export async function getWorkspaceStatus(
	env: Partial<Record<typeof WORKSPACE_ENV, string>> = process.env
): Promise<WorkspaceStatus> {
	const configuredPath = env[WORKSPACE_ENV]?.trim();

	if (!configuredPath) {
		return {
			status: 'missing',
			variable: WORKSPACE_ENV,
			message: `Set ${WORKSPACE_ENV} to the workspace directory before managing projects.`
		};
	}

	const workspacePath = resolve(configuredPath);

	try {
		const workspaceStat = await stat(workspacePath);

		if (!workspaceStat.isDirectory()) {
			return {
				status: 'invalid',
				path: workspacePath,
				message: 'The configured workspace path exists but is not a directory.'
			};
		}

		await access(workspacePath, constants.R_OK | constants.W_OK);
		await readdir(workspacePath);
	} catch (error) {
		const code = error instanceof Error && 'code' in error ? error.code : undefined;

		if (code === 'ENOENT' || code === 'ENOTDIR') {
			return {
				status: 'invalid',
				path: workspacePath,
				message: 'The configured workspace directory does not exist.'
			};
		}

		return {
			status: 'inaccessible',
			path: workspacePath,
			message: 'The configured workspace directory cannot be accessed by Bright Desk.'
		};
	}

	return {
		status: 'ready',
		path: workspacePath
	};
}

export function resolveWorkspacePath(workspacePath: string, ...segments: string[]): string {
	if (segments.some((segment) => isAbsolute(segment))) {
		throw new Error('Workspace paths must be relative to the configured workspace.');
	}

	const root = resolve(workspacePath);
	const target = resolve(root, ...segments);
	const targetRelativePath = relative(root, target);

	if (
		targetRelativePath === '..' ||
		targetRelativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) ||
		isAbsolute(targetRelativePath)
	) {
		throw new Error('Resolved path escapes the configured workspace.');
	}

	return target;
}
