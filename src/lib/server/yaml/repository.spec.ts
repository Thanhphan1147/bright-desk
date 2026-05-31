import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { tasksFileSchema } from './schema';
import { readVersionedYaml, writeYamlAtomic, YamlRepositoryError } from './repository';

const temporaryRoots: string[] = [];
const timestamp = '2026-05-30T17:53:42+02:00';

async function createTemporaryRoot() {
	const root = await mkdtemp(join(tmpdir(), 'bright-desk-yaml-'));
	temporaryRoots.push(root);
	return root;
}

afterEach(async () => {
	await Promise.all(
		temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	);
});

describe('YAML repository', () => {
	it('writes atomically and reads versioned YAML data', async () => {
		expect.assertions(5);
		const root = await createTemporaryRoot();
		const filePath = join(root, 'project', 'tasks.yaml');

		const version = await writeYamlAtomic(
			filePath,
			{
				schema_version: 1,
				tasks: [
					{
						id: 'task-001',
						title: 'Persist YAML',
						status: 'pending',
						created_at: timestamp,
						updated_at: timestamp,
						git: { branch: 'agent/task-001-persist-yaml', checkout_dir: 'checkouts/task-001' },
						x_unknown: { keep: true }
					}
				],
				x_file_unknown: 'keep'
			},
			tasksFileSchema
		);

		const raw = await readFile(filePath, 'utf8');
		const loaded = await readVersionedYaml(filePath, tasksFileSchema);

		expect(raw).toContain('x_unknown');
		expect(loaded.data.x_file_unknown).toBe('keep');
		expect(loaded.data.tasks[0].x_unknown).toEqual({ keep: true });
		expect(loaded.version.sha256).toHaveLength(64);
		expect(version.sha256).toBe(loaded.version.sha256);
	});

	it('rejects invalid data before writing', async () => {
		expect.assertions(1);
		const root = await createTemporaryRoot();

		await expect(
			writeYamlAtomic(
				join(root, 'tasks.yaml'),
				{
					schema_version: 1,
					tasks: [
						{
							id: 'task-001',
							title: '',
							status: 'pending',
							created_at: timestamp,
							updated_at: timestamp,
							git: { branch: 'agent/task-001', checkout_dir: 'checkouts/task-001' }
						}
					]
				},
				tasksFileSchema
			)
		).rejects.toBeInstanceOf(YamlRepositoryError);
	});

	it('rejects invalid YAML file contents', async () => {
		expect.assertions(1);
		const root = await createTemporaryRoot();
		const filePath = join(root, 'tasks.yaml');
		await writeYamlAtomic(filePath, { schema_version: 1, tasks: [] }, tasksFileSchema);
		await rm(filePath);
		await import('node:fs/promises').then(({ writeFile }) => writeFile(filePath, 'tasks: ['));

		await expect(readVersionedYaml(filePath, tasksFileSchema)).rejects.toThrow();
	});
});
