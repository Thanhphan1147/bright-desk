import { z } from 'zod';

const timestampSchema = z.iso.datetime({ offset: true });
const nonEmptyStringSchema = z.string().trim().min(1);
const relativePathSchema = nonEmptyStringSchema.refine((value) => !value.startsWith('/'), {
	message: 'Expected a relative path'
});

export const githubUrlSchema = z
	.url()
	.regex(/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+$/, 'Expected https://github.com/{owner}/{repo}');

export const projectSchema = z
	.object({
		schema_version: z.literal(1),
		id: nonEmptyStringSchema,
		name: nonEmptyStringSchema,
		description: z.string().optional(),
		status: z.enum(['active', 'paused', 'archived']).optional(),
		github: z
			.object({
				url: githubUrlSchema
			})
			.passthrough(),
		created_at: timestampSchema.optional(),
		updated_at: timestampSchema.optional(),
		agent_instructions: z
			.object({
				primary_context_files: z.array(relativePathSchema).optional()
			})
			.passthrough()
			.optional()
	})
	.passthrough();

export const taskStatusSchema = z.enum([
	'pending',
	'in_progress',
	'blocked',
	'completed',
	'failed',
	'cancelled'
]);

export const taskSchema = z
	.object({
		id: nonEmptyStringSchema,
		title: nonEmptyStringSchema,
		status: taskStatusSchema,
		priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
		created_at: timestampSchema,
		updated_at: timestampSchema,
		description: z.string().optional(),
		git: z
			.object({
				branch: nonEmptyStringSchema,
				checkout_dir: relativePathSchema
			})
			.passthrough(),
		acceptance_criteria: z.array(z.string()).optional(),
		agent: z.record(z.string(), z.unknown()).optional(),
		result: z.record(z.string(), z.unknown()).optional()
	})
	.passthrough();

export const tasksFileSchema = z
	.object({
		schema_version: z.literal(1),
		tasks: z.array(taskSchema)
	})
	.passthrough();

export const decisionSchema = z
	.object({
		id: nonEmptyStringSchema,
		task_id: nonEmptyStringSchema.optional(),
		status: z.enum(['pending', 'answered', 'resolved', 'cancelled']),
		question: nonEmptyStringSchema,
		context: z.string().optional(),
		options: z
			.array(
				z
					.object({
						id: nonEmptyStringSchema,
						label: nonEmptyStringSchema
					})
					.passthrough()
			)
			.optional(),
		answer: z.record(z.string(), z.unknown()).optional(),
		created_at: timestampSchema,
		updated_at: timestampSchema
	})
	.passthrough();

export const decisionsFileSchema = z
	.object({
		schema_version: z.literal(1),
		decisions: z.array(decisionSchema)
	})
	.passthrough();

export const completedTaskSchema = taskSchema
	.extend({
		status: z.literal('completed'),
		completed_at: timestampSchema.optional(),
		archived_at: timestampSchema.optional()
	})
	.passthrough();

export const completedTasksFileSchema = z
	.object({
		schema_version: z.literal(1),
		completed_tasks: z.array(completedTaskSchema)
	})
	.passthrough();

export type ProjectFile = z.infer<typeof projectSchema>;
export type TasksFile = z.infer<typeof tasksFileSchema>;
export type DecisionsFile = z.infer<typeof decisionsFileSchema>;
export type CompletedTasksFile = z.infer<typeof completedTasksFileSchema>;
