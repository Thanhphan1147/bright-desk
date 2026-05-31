import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { getWorkspaceStatus, resolveWorkspacePath } from './workspace';

const temporaryRoots: string[] = [];

async function createTemporaryRoot() {
	const root = await mkdtemp(join(tmpdir(), 'bright-desk-workspace-'));
	temporaryRoots.push(root);
	return root;
}

afterEach(async () => {
	await Promise.all(
		temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	);
});

describe('getWorkspaceStatus', () => {
	it('reports missing configuration when BRIGHT_DESK_WORKSPACE is empty', async () => {
		expect.assertions(1);

		await expect(getWorkspaceStatus({ BRIGHT_DESK_WORKSPACE: '' })).resolves.toMatchObject({
			status: 'missing',
			variable: 'BRIGHT_DESK_WORKSPACE'
		});
	});

	it('accepts an existing workspace directory', async () => {
		expect.assertions(1);
		const root = await createTemporaryRoot();

		await expect(getWorkspaceStatus({ BRIGHT_DESK_WORKSPACE: root })).resolves.toEqual({
			status: 'ready',
			path: root
		});
	});

	it('rejects a missing workspace directory', async () => {
		expect.assertions(1);
		const root = await createTemporaryRoot();

		await expect(
			getWorkspaceStatus({ BRIGHT_DESK_WORKSPACE: join(root, 'missing') })
		).resolves.toMatchObject({
			status: 'invalid',
			message: 'The configured workspace directory does not exist.'
		});
	});

	it('rejects a file configured as the workspace', async () => {
		expect.assertions(1);
		const root = await createTemporaryRoot();
		const filePath = join(root, 'workspace.txt');
		await writeFile(filePath, '');

		await expect(getWorkspaceStatus({ BRIGHT_DESK_WORKSPACE: filePath })).resolves.toMatchObject({
			status: 'invalid',
			path: filePath,
			message: 'The configured workspace path exists but is not a directory.'
		});
	});

	it('reports inaccessible directories', async () => {
		expect.assertions(1);
		const root = await createTemporaryRoot();
		const workspace = join(root, 'workspace');
		await mkdir(workspace);
		await chmod(workspace, 0o000);

		try {
			const status = await getWorkspaceStatus({ BRIGHT_DESK_WORKSPACE: workspace });
			expect(['ready', 'inaccessible']).toContain(status.status);
		} finally {
			await chmod(workspace, 0o700);
		}
	});
});

describe('resolveWorkspacePath', () => {
	it('resolves relative paths inside the workspace', () => {
		expect.assertions(1);

		expect(resolveWorkspacePath('/workspace', 'project', 'tasks.yaml')).toBe(
			'/workspace/project/tasks.yaml'
		);
	});

	it('rejects absolute child paths', () => {
		expect.assertions(1);

		expect(() => resolveWorkspacePath('/workspace', '/etc/passwd')).toThrow(
			'Workspace paths must be relative'
		);
	});

	it('rejects traversal outside the workspace', () => {
		expect.assertions(1);

		expect(() => resolveWorkspacePath('/workspace', '..', 'outside')).toThrow(
			'escapes the configured workspace'
		);
	});
});
