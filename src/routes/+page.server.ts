import { getWorkspaceStatus } from '$lib/server/workspace';
import { discoverProjects } from '$lib/server/projects';

export async function load() {
	const workspace = await getWorkspaceStatus();

	return {
		workspace,
		projects: workspace.status === 'ready' ? await discoverProjects(workspace.path) : []
	};
}
