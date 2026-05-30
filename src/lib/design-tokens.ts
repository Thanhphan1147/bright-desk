export const statusTone = {
	pending: 'neutral',
	in_progress: 'primary',
	blocked: 'warning',
	completed: 'success',
	failed: 'danger',
	cancelled: 'neutral',
	answered: 'decision',
	resolved: 'success'
} as const;

export type Status = keyof typeof statusTone;
