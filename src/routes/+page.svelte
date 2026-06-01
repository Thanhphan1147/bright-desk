<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let createProjectMessage = $state('');
	let createProjectError = $state('');
	let isCreatingProject = $state(false);
	let createdProjects = $state<PageData['projects']>([]);

	let projects = $derived(
		[...data.projects, ...createdProjects].sort((a, b) => a.name.localeCompare(b.name))
	);
	let selectedProject = $derived(projects[0]);

	const statusClasses = {
		in_progress: 'bg-primary-soft text-primary',
		pending: 'bg-warning-soft text-warning'
	} as const;

	const tasks: Array<{
		title: string;
		status: keyof typeof statusClasses;
		priority: string;
		branch: string;
		checkout: string;
		description: string;
	}> = [
		{
			title: 'Bootstrap the SvelteKit app shell',
			status: 'in_progress',
			priority: 'high',
			branch: 'agent/task-000-bootstrap-sveltekit-shell',
			checkout: 'checkouts/task-000--agent-task-000-bootstrap-sveltekit-shell',
			description: 'Create the minimal app scaffold, design tokens, and Bright Desk shell.'
		},
		{
			title: 'Configure workspace path safety',
			status: 'pending',
			priority: 'high',
			branch: 'agent/task-001-workspace-configuration',
			checkout: 'checkouts/task-001--agent-task-001-workspace-configuration',
			description: 'Load a configured workspace and prevent access outside that boundary.'
		}
	];

	const baseCard = 'rounded-[1.25rem] border border-border bg-surface';
	const eyebrow = 'text-xs font-bold tracking-[0.08em] text-muted uppercase';
	const chip = 'rounded-full px-2.5 py-1 text-[0.8125rem] font-bold';
	const workspaceState = {
		ready: {
			label: 'Workspace ready',
			classes: 'border-success bg-success-soft text-success'
		},
		missing: {
			label: 'Workspace missing',
			classes: 'border-warning bg-warning-soft text-warning'
		},
		invalid: {
			label: 'Workspace invalid',
			classes: 'border-danger bg-danger-soft text-danger'
		},
		inaccessible: {
			label: 'Workspace inaccessible',
			classes: 'border-danger bg-danger-soft text-danger'
		}
	} as const;

	function repositoryLabel(githubUrl?: string) {
		return githubUrl?.replace(/^https:\/\/github\.com\//, '') ?? 'Repository not configured';
	}

	async function createProject(event: SubmitEvent) {
		event.preventDefault();

		const form = event.currentTarget;

		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		const formData = new FormData(form);
		createProjectError = '';
		createProjectMessage = '';
		isCreatingProject = true;

		try {
			const response = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: formData.get('name'),
					githubUrl: formData.get('githubUrl')
				})
			});
			const result = await response.json();

			if (!response.ok) {
				createProjectError = result.message ?? 'Project could not be created.';
				return;
			}

			createProjectMessage = `Created ${result.project.name}.`;
			createdProjects = [...createdProjects, result.project];
			form.reset();
		} catch (error) {
			createProjectError = error instanceof Error ? error.message : 'Project could not be created.';
		} finally {
			isCreatingProject = false;
		}
	}

	function openRepository(url: string) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>Bright Desk</title>
	<meta
		name="description"
		content="A minimal browser workspace for AI-agent tasks and human decisions."
	/>
</svelte:head>

<main
	class="grid min-h-screen grid-cols-1 gap-6 p-4 text-ink md:p-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)_24rem]"
	aria-label="Bright Desk workspace"
>
	<aside class={`${baseCard} self-start p-4`} aria-label="Projects">
		<div class="mb-6 flex items-start gap-4">
			<div
				class="grid size-11 place-items-center rounded-[0.875rem] bg-primary font-extrabold text-white"
			>
				BD
			</div>
			<div>
				<p class={eyebrow}>Agent workspace</p>
				<h1 class="text-xl font-bold">Bright Desk</h1>
			</div>
		</div>

		<nav class="grid gap-2" aria-label="Project list">
			{#if projects.length === 0}
				<p class="rounded-[0.875rem] bg-surface-muted p-3.5 text-sm text-muted">
					No projects found. Create one to initialize workspace YAML files.
				</p>
			{/if}
			{#each projects as project, index (project.id)}
				<button
					class={`grid gap-2 rounded-[0.875rem] border-y-0 border-r-0 border-l-[3px] p-3.5 text-left text-ink transition hover:bg-surface-muted ${
						index === 0 ? 'border-l-primary bg-primary-soft' : 'border-l-transparent bg-transparent'
					}`}
					type="button"
					aria-current={index === 0 ? 'page' : undefined}
				>
					<span>
						<strong class="block">{project.name}</strong>
						<small class="font-mono text-muted">{repositoryLabel(project.githubUrl)}</small>
					</span>
					<span class="text-[0.8125rem] text-muted">
						{project.pendingDecisions} decisions · {project.activeTasks} tasks
						{#if project.error}
							<em
								class="ml-1 inline-block rounded-full bg-danger-soft px-1.5 py-0.5 text-danger not-italic"
							>
								Invalid YAML
							</em>
						{/if}
					</span>
				</button>
			{/each}
		</nav>
	</aside>

	<section class="grid min-w-0 content-start gap-4" aria-labelledby="project-title">
		<section
			class={`rounded-[1.25rem] border p-4 ${workspaceState[data.workspace.status].classes}`}
			aria-labelledby="workspace-status-title"
		>
			<div class="grid gap-2 md:flex md:items-start md:justify-between">
				<div>
					<p class="text-xs font-bold tracking-[0.08em] uppercase">
						{workspaceState[data.workspace.status].label}
					</p>
					<h2 id="workspace-status-title" class="text-lg font-bold">
						{#if data.workspace.status === 'ready'}
							Project files are constrained to the configured workspace.
						{:else}
							Workspace configuration needs attention.
						{/if}
					</h2>
					<p class="mt-1">
						{#if data.workspace.status === 'ready'}
							Bright Desk will only read and write below this directory.
						{:else}
							{data.workspace.message}
						{/if}
					</p>
				</div>
				<code class="break-anywhere rounded-xl bg-white/55 px-3 py-2 font-mono text-[0.8125rem]">
					{#if data.workspace.status === 'missing'}
						{data.workspace.variable}
					{:else}
						{data.workspace.path}
					{/if}
				</code>
			</div>
		</section>

		<header class={`${baseCard} grid gap-4 p-5 md:flex md:items-start md:justify-between`}>
			<div>
				<p class={eyebrow}>Selected project</p>
				<h2
					id="project-title"
					class="text-4xl leading-none font-bold tracking-[-0.05em] md:text-6xl"
				>
					{selectedProject?.name ?? 'No project selected'}
				</h2>
				{#if selectedProject?.githubUrl}
					<button
						class="font-mono text-muted hover:text-primary"
						type="button"
						onclick={() => selectedProject?.githubUrl && openRepository(selectedProject.githubUrl)}
					>
						{repositoryLabel(selectedProject.githubUrl)}
					</button>
				{:else}
					<p class="font-mono text-muted">Create a project with a GitHub repository URL.</p>
				{/if}
			</div>
			<div class="flex flex-wrap gap-3">
				<button
					class="rounded-full border border-border bg-surface px-4 py-2.5 font-bold text-ink"
					type="button"
				>
					Refresh project
				</button>
				<button
					class="rounded-full border border-primary bg-primary px-4 py-2.5 font-bold text-white"
					type="button"
				>
					Add task
				</button>
			</div>
		</header>

		<div class="flex flex-wrap gap-2" aria-label="Project summary">
			<span class={`${chip} bg-surface-muted text-muted`}>
				{selectedProject?.pendingDecisions ?? 0} pending decisions
			</span>
			<span class={`${chip} bg-surface-muted text-muted`}>
				{selectedProject?.activeTasks ?? 0} active tasks
			</span>
			<span class={`${chip} bg-surface-muted text-muted`}>
				{selectedProject?.completedTasks ?? 0} completed
			</span>
		</div>

		<section
			class={`${baseCard} border-t-4 border-t-decision p-5`}
			aria-labelledby="decisions-title"
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class={eyebrow}>Human input</p>
					<h3 id="decisions-title" class="text-xl font-bold">Pending decisions</h3>
				</div>
				<span class={`${chip} bg-decision-soft text-decision`}>Clear</span>
			</div>
			<p class="mt-4 text-muted">No pending decisions. The next blocker will appear here first.</p>
		</section>

		<section class={`${baseCard} p-5`} aria-labelledby="tasks-title">
			<div class="grid gap-4 md:flex md:items-start md:justify-between">
				<div>
					<p class={eyebrow}>Implementation</p>
					<h3 id="tasks-title" class="text-xl font-bold">Active tasks</h3>
				</div>
				<button
					class="rounded-full border border-border bg-surface px-4 py-2.5 font-bold text-ink"
					type="button"
				>
					Clean up completed
				</button>
			</div>

			<div class="mt-4 grid gap-3.5">
				{#each tasks as task (task.branch)}
					<article class="grid gap-3 rounded-2xl border border-border p-4">
						<div class="grid gap-3 md:flex md:items-start md:justify-between">
							<h4 class="font-bold">{task.title}</h4>
							<div class="flex flex-wrap gap-1.5 md:justify-end">
								<span class={`${chip} ${statusClasses[task.status]}`}>{task.status}</span>
								<span class={`${chip} bg-surface-muted text-muted`}>{task.priority}</span>
							</div>
						</div>
						<p class="text-muted">{task.description}</p>
						<dl class="grid gap-1.5">
							<div class="grid gap-0.5">
								<dt class="text-xs font-bold text-muted">Git branch</dt>
								<dd class="overflow-wrap-anywhere font-mono text-[0.8125rem] text-muted">
									{task.branch}
								</dd>
							</div>
							<div class="grid gap-0.5">
								<dt class="text-xs font-bold text-muted">Checkout directory</dt>
								<dd class="overflow-wrap-anywhere font-mono text-[0.8125rem] text-muted">
									{task.checkout}
								</dd>
							</div>
						</dl>
					</article>
				{/each}
			</div>
		</section>
	</section>

	<aside
		class={`${baseCard} grid gap-4 self-start p-4 lg:col-span-2 xl:col-span-1`}
		aria-labelledby="detail-title"
	>
		<p class={eyebrow}>Project setup</p>
		<h3 id="detail-title" class="text-xl font-bold">Create project</h3>
		<form class="grid gap-4" onsubmit={createProject}>
			<label class="grid gap-1.5 font-bold">
				Project name
				<input
					class="w-full rounded-xl border border-border p-3 text-ink"
					name="name"
					placeholder="Bright Desk"
					required
				/>
			</label>
			<label class="grid gap-1.5 font-bold">
				GitHub repository URL
				<input
					class="w-full rounded-xl border border-border p-3 text-ink"
					name="githubUrl"
					placeholder="https://github.com/owner/repo"
					required
				/>
			</label>
			<p class="text-muted">
				Creates project.yaml, tasks.yaml, pending_decisions.yaml, and completed_tasks.yaml.
			</p>
			{#if createProjectError}
				<p class="rounded-xl bg-danger-soft p-3 font-bold text-danger">{createProjectError}</p>
			{/if}
			{#if createProjectMessage}
				<p class="rounded-xl bg-success-soft p-3 font-bold text-success">{createProjectMessage}</p>
			{/if}
			<button
				class="rounded-full border border-primary bg-primary px-4 py-2.5 font-bold text-white disabled:opacity-60"
				type="submit"
				disabled={isCreatingProject || data.workspace.status !== 'ready'}
			>
				{isCreatingProject ? 'Creating...' : 'Create project'}
			</button>
		</form>
	</aside>
</main>
