import { getWorkspaceStatus } from '$lib/server/workspace';

export async function load() {
	return {
		workspace: await getWorkspaceStatus()
	};
}
