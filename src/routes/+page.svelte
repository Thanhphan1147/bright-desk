<script lang="ts">
	const projects = [
		{ name: 'Bright Desk', repo: 'Thanhphan1147/bright-desk', decisions: 0, tasks: 11, blocked: 0 },
		{
			name: 'Snap Packaging',
			repo: 'Thanhphan1147/bright-desk',
			decisions: 1,
			tasks: 3,
			blocked: 1
		},
		{ name: 'Agent Runtime Later', repo: 'future/runtime', decisions: 0, tasks: 2, blocked: 0 }
	];

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
			{#each projects as project, index (project.name)}
				<button
					class={`grid gap-2 rounded-[0.875rem] border-y-0 border-r-0 border-l-[3px] p-3.5 text-left text-ink transition hover:bg-surface-muted ${
						index === 0 ? 'border-l-primary bg-primary-soft' : 'border-l-transparent bg-transparent'
					}`}
					type="button"
					aria-current={index === 0 ? 'page' : undefined}
				>
					<span>
						<strong class="block">{project.name}</strong>
						<small class="font-mono text-muted">{project.repo}</small>
					</span>
					<span class="text-[0.8125rem] text-muted">
						{project.decisions} decisions · {project.tasks} tasks
						{#if project.blocked}
							<em
								class="ml-1 inline-block rounded-full bg-warning-soft px-1.5 py-0.5 text-warning not-italic"
							>
								{project.blocked} blocked
							</em>
						{/if}
					</span>
				</button>
			{/each}
		</nav>
	</aside>

	<section class="grid min-w-0 content-start gap-4" aria-labelledby="project-title">
		<header class={`${baseCard} grid gap-4 p-5 md:flex md:items-start md:justify-between`}>
			<div>
				<p class={eyebrow}>Selected project</p>
				<h2
					id="project-title"
					class="text-4xl leading-none font-bold tracking-[-0.05em] md:text-6xl"
				>
					Bright Desk
				</h2>
				<a
					class="font-mono text-muted hover:text-primary"
					href="https://github.com/Thanhphan1147/bright-desk"
					target="_blank"
					rel="noopener noreferrer"
				>
					github.com/Thanhphan1147/bright-desk
				</a>
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
			<span class={`${chip} bg-surface-muted text-muted`}>0 pending decisions</span>
			<span class={`${chip} bg-surface-muted text-muted`}>11 active tasks</span>
			<span class={`${chip} bg-surface-muted text-muted`}>0 blocked</span>
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
		<p class={eyebrow}>Task draft</p>
		<h3 id="detail-title" class="text-xl font-bold">Create task</h3>
		<label class="grid gap-1.5 font-bold">
			Task title
			<input
				class="w-full rounded-xl border border-border p-3 text-ink"
				value="Configure workspace path safety"
			/>
		</label>
		<label class="grid gap-1.5 font-bold">
			Git branch
			<input
				class="w-full rounded-xl border border-border p-3 text-ink"
				value="agent/task-001-workspace-configuration"
			/>
		</label>
		<p class="text-muted">Agents will check out the project repository on this branch.</p>
		<label class="grid gap-1.5 font-bold">
			Description
			<textarea class="w-full resize-y rounded-xl border border-border p-3 text-ink" rows="5"
				>Load a configured workspace and prevent access outside that boundary.</textarea
			>
		</label>
		<div class="grid gap-1 rounded-xl bg-surface-muted p-3">
			<span class="text-xs font-bold text-muted">Checkout directory</span>
			<code class="break-anywhere font-mono text-[0.8125rem] text-muted">
				checkouts/task-001--agent-task-001-workspace-configuration
			</code>
		</div>
		<button
			class="rounded-full border border-primary bg-primary px-4 py-2.5 font-bold text-white"
			type="button"
		>
			Create task
		</button>
	</aside>
</main>
