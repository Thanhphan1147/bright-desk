import { describe, expect, it } from 'vitest';

import {
	completedTasksFileSchema,
	decisionsFileSchema,
	projectSchema,
	tasksFileSchema
} from './schema';

const timestamp = '2026-05-30T17:53:42+02:00';

describe('workspace YAML schemas', () => {
	it('validates project.yaml and preserves unknown fields', () => {
		expect.assertions(2);

		const project = projectSchema.parse({
			schema_version: 1,
			id: 'bright-desk',
			name: 'Bright Desk',
			status: 'active',
			github: { url: 'https://github.com/Thanhphan1147/bright-desk', default_branch: 'main' },
			agent_instructions: { primary_context_files: ['context/overview.md'] },
			x_custom: { owner: 'human' }
		});

		expect(project.github.default_branch).toBe('main');
		expect(project.x_custom).toEqual({ owner: 'human' });
	});

	it('rejects non-canonical GitHub repository URLs', () => {
		expect.assertions(1);

		expect(() =>
			projectSchema.parse({
				schema_version: 1,
				id: 'bad',
				name: 'Bad',
				github: { url: 'git@github.com:owner/repo.git' }
			})
		).toThrow();
	});

	it('validates tasks.yaml with branch and checkout metadata', () => {
		expect.assertions(1);

		const tasks = tasksFileSchema.parse({
			schema_version: 1,
			tasks: [
				{
					id: 'task-001',
					title: 'Build schemas',
					status: 'pending',
					priority: 'high',
					created_at: timestamp,
					updated_at: timestamp,
					git: {
						branch: 'agent/task-001-build-schemas',
						checkout_dir: 'checkouts/task-001--agent-task-001-build-schemas'
					},
					custom_agent_hint: 'preserve me'
				}
			]
		});

		expect(tasks.tasks[0].custom_agent_hint).toBe('preserve me');
	});

	it('rejects task checkout paths outside the project', () => {
		expect.assertions(1);

		expect(() =>
			tasksFileSchema.parse({
				schema_version: 1,
				tasks: [
					{
						id: 'task-001',
						title: 'Bad checkout',
						status: 'pending',
						created_at: timestamp,
						updated_at: timestamp,
						git: { branch: 'agent/task-001', checkout_dir: '/tmp/repo' }
					}
				]
			})
		).toThrow();
	});

	it('validates pending_decisions.yaml with answer metadata', () => {
		expect.assertions(1);

		const decisions = decisionsFileSchema.parse({
			schema_version: 1,
			decisions: [
				{
					id: 'decision-001',
					task_id: 'task-001',
					status: 'answered',
					question: 'Which path?',
					answer: { selected_option_id: 'a', text: 'Use option A', answered_at: timestamp },
					created_at: timestamp,
					updated_at: timestamp
				}
			]
		});

		expect(decisions.decisions[0].answer?.selected_option_id).toBe('a');
	});

	it('validates completed_tasks.yaml with completed tasks only', () => {
		expect.assertions(1);

		expect(() =>
			completedTasksFileSchema.parse({
				schema_version: 1,
				completed_tasks: [
					{
						id: 'task-001',
						title: 'Still running',
						status: 'in_progress',
						created_at: timestamp,
						updated_at: timestamp,
						git: { branch: 'agent/task-001', checkout_dir: 'checkouts/task-001' }
					}
				]
			})
		).toThrow();
	});
});
