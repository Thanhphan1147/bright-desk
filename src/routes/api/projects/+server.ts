import { json, error } from '@sveltejs/kit';

import { createProject, discoverProjects, ProjectValidationError } from '$lib/server/projects';
import { getWorkspaceStatus } from '$lib/server/workspace';

export async function GET() {
	const workspace = await getWorkspaceStatus();

	if (workspace.status !== 'ready') {
		return json({ workspace, projects: [] }, { status: 503 });
	}

	return json({ workspace, projects: await discoverProjects(workspace.path) });
}

export async function POST({ request }) {
	const workspace = await getWorkspaceStatus();

	if (workspace.status !== 'ready') {
		return json({ workspace, message: workspace.message }, { status: 503 });
	}

	const body = await request.json().catch(() => {
		throw error(400, 'Expected a JSON request body.');
	});

	try {
		const project = await createProject(workspace.path, {
			name: String(body.name ?? ''),
			githubUrl: String(body.githubUrl ?? '')
		});

		return json({ project }, { status: 201 });
	} catch (caught) {
		if (caught instanceof ProjectValidationError) {
			return json({ message: caught.message }, { status: 400 });
		}

		throw caught;
	}
}
