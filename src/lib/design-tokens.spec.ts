import { describe, expect, it } from 'vitest';

import { statusTone } from './design-tokens';

describe('statusTone', () => {
	it('maps task and decision statuses to semantic tones', () => {
		expect(statusTone).toMatchObject({
			pending: 'neutral',
			in_progress: 'primary',
			blocked: 'warning',
			completed: 'success',
			failed: 'danger',
			cancelled: 'neutral',
			answered: 'decision',
			resolved: 'success'
		});
	});
});
