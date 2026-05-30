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

	const tasks = [
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
</script>

<svelte:head>
	<title>Bright Desk</title>
	<meta
		name="description"
		content="A minimal browser workspace for AI-agent tasks and human decisions."
	/>
</svelte:head>

<main class="shell" aria-label="Bright Desk workspace">
	<aside class="sidebar" aria-label="Projects">
		<div class="brand">
			<div class="brand-mark">BD</div>
			<div>
				<p class="eyebrow">Agent workspace</p>
				<h1>Bright Desk</h1>
			</div>
		</div>

		<nav class="project-list" aria-label="Project list">
			{#each projects as project, index (project.name)}
				<button
					class:selected={index === 0}
					type="button"
					aria-current={index === 0 ? 'page' : undefined}
				>
					<span>
						<strong>{project.name}</strong>
						<small>{project.repo}</small>
					</span>
					<span class="counts">
						{project.decisions} decisions · {project.tasks} tasks
						{#if project.blocked}
							<em>{project.blocked} blocked</em>
						{/if}
					</span>
				</button>
			{/each}
		</nav>
	</aside>

	<section class="content" aria-labelledby="project-title">
		<header class="project-header">
			<div>
				<p class="eyebrow">Selected project</p>
				<h2 id="project-title">Bright Desk</h2>
				<a class="repo-link" href="https://github.com/Thanhphan1147/bright-desk">
					github.com/Thanhphan1147/bright-desk
				</a>
			</div>
			<div class="actions">
				<button class="secondary" type="button">Refresh project</button>
				<button type="button">Add task</button>
			</div>
		</header>

		<div class="summary" aria-label="Project summary">
			<span>0 pending decisions</span>
			<span>11 active tasks</span>
			<span>0 blocked</span>
		</div>

		<section class="panel decision-panel" aria-labelledby="decisions-title">
			<div class="section-heading">
				<div>
					<p class="eyebrow">Human input</p>
					<h3 id="decisions-title">Pending decisions</h3>
				</div>
				<span class="chip decision">Clear</span>
			</div>
			<p class="empty-state">No pending decisions. The next blocker will appear here first.</p>
		</section>

		<section class="panel" aria-labelledby="tasks-title">
			<div class="section-heading">
				<div>
					<p class="eyebrow">Implementation</p>
					<h3 id="tasks-title">Active tasks</h3>
				</div>
				<button class="secondary" type="button">Clean up completed</button>
			</div>

			<div class="task-list">
				{#each tasks as task (task.branch)}
					<article class="task-card">
						<div class="task-topline">
							<h4>{task.title}</h4>
							<div>
								<span class={`chip ${task.status}`}>{task.status}</span>
								<span class="chip neutral">{task.priority}</span>
							</div>
						</div>
						<p>{task.description}</p>
						<dl>
							<div>
								<dt>Git branch</dt>
								<dd>{task.branch}</dd>
							</div>
							<div>
								<dt>Checkout directory</dt>
								<dd>{task.checkout}</dd>
							</div>
						</dl>
					</article>
				{/each}
			</div>
		</section>
	</section>

	<aside class="detail" aria-labelledby="detail-title">
		<p class="eyebrow">Task draft</p>
		<h3 id="detail-title">Create task</h3>
		<label>
			Task title
			<input value="Configure workspace path safety" />
		</label>
		<label>
			Git branch
			<input value="agent/task-001-workspace-configuration" />
		</label>
		<p class="helper">Agents will check out the project repository on this branch.</p>
		<label>
			Description
			<textarea rows="5"
				>Load a configured workspace and prevent access outside that boundary.</textarea
			>
		</label>
		<div class="readonly">
			<span>Checkout directory</span>
			<code>checkouts/task-001--agent-task-001-workspace-configuration</code>
		</div>
		<button type="button">Create task</button>
	</aside>
</main>

<style>
	.shell {
		display: grid;
		grid-template-columns: 20rem minmax(0, 1fr) 24rem;
		gap: 1.5rem;
		min-height: 100vh;
		padding: 1.5rem;
	}

	.sidebar,
	.content,
	.detail {
		min-width: 0;
	}

	.sidebar,
	.detail,
	.panel,
	.project-header {
		border: 1px solid var(--color-border);
		border-radius: 1.25rem;
		background: var(--color-surface);
	}

	.sidebar,
	.detail {
		align-self: start;
		padding: 1rem;
	}

	.brand,
	.project-header,
	.section-heading,
	.task-topline {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	.brand {
		justify-content: flex-start;
		margin-bottom: 1.5rem;
	}

	.brand-mark {
		display: grid;
		width: 2.75rem;
		height: 2.75rem;
		place-items: center;
		border-radius: 0.875rem;
		background: var(--color-primary);
		color: white;
		font-weight: 800;
	}

	h1,
	h2,
	h3,
	h4,
	p {
		margin: 0;
	}

	h1 {
		font-size: 1.25rem;
	}

	h2 {
		font-size: clamp(2rem, 4vw, 3.5rem);
		letter-spacing: -0.05em;
	}

	h3 {
		font-size: 1.25rem;
	}

	h4 {
		font-size: 1rem;
	}

	.eyebrow {
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.project-list {
		display: grid;
		gap: 0.5rem;
	}

	.project-list button {
		display: grid;
		gap: 0.5rem;
		border-left: 3px solid transparent;
		border-radius: 0.875rem;
		border-top: 0;
		border-right: 0;
		border-bottom: 0;
		background: transparent;
		padding: 0.875rem;
		color: var(--color-text);
		text-align: left;
		text-decoration: none;
	}

	.project-list button.selected {
		border-left-color: var(--color-primary);
		background: var(--color-primary-soft);
	}

	small,
	.counts,
	.repo-link,
	.helper {
		color: var(--color-text-muted);
	}

	small,
	.repo-link,
	code,
	dd {
		font-family: var(--font-mono);
	}

	.counts {
		font-size: 0.8125rem;
	}

	em {
		display: inline-block;
		margin-left: 0.25rem;
		border-radius: 999px;
		background: var(--color-warning-soft);
		padding: 0.125rem 0.375rem;
		color: var(--color-warning);
		font-style: normal;
	}

	.content {
		display: grid;
		align-content: start;
		gap: 1rem;
	}

	.project-header {
		padding: 1.25rem;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
	}

	button {
		border: 1px solid var(--color-primary);
		border-radius: 999px;
		background: var(--color-primary);
		padding: 0.625rem 1rem;
		color: white;
		font-weight: 700;
		cursor: pointer;
	}

	button.secondary {
		border-color: var(--color-border);
		background: white;
		color: var(--color-text);
	}

	.project-list button {
		border-top: 0;
		border-right: 0;
		border-bottom: 0;
		background: transparent;
		color: var(--color-text);
		text-align: left;
	}

	.project-list button.selected {
		background: var(--color-primary-soft);
	}

	.summary {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.summary span,
	.chip {
		border-radius: 999px;
		padding: 0.25rem 0.625rem;
		font-size: 0.8125rem;
		font-weight: 700;
	}

	.summary span,
	.chip.neutral {
		background: var(--color-surface-muted);
		color: var(--color-text-muted);
	}

	.chip.decision {
		background: var(--color-decision-soft);
		color: var(--color-decision);
	}

	.chip.in_progress {
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}

	.chip.pending {
		background: var(--color-warning-soft);
		color: var(--color-warning);
	}

	.panel {
		padding: 1.25rem;
	}

	.decision-panel {
		border-top: 4px solid var(--color-decision);
	}

	.empty-state {
		margin-top: 1rem;
		color: var(--color-text-muted);
	}

	.task-list {
		display: grid;
		gap: 0.875rem;
		margin-top: 1rem;
	}

	.task-card {
		display: grid;
		gap: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 1rem;
		padding: 1rem;
	}

	.task-card p {
		color: var(--color-text-muted);
	}

	.task-topline > div {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.375rem;
	}

	dl {
		display: grid;
		gap: 0.375rem;
		margin: 0;
	}

	dl div {
		display: grid;
		gap: 0.125rem;
	}

	dt,
	.readonly span {
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 700;
	}

	dd {
		margin: 0;
		overflow-wrap: anywhere;
		color: var(--color-text-muted);
		font-size: 0.8125rem;
	}

	.detail {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.375rem;
		font-weight: 700;
	}

	input,
	textarea {
		width: 100%;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 0.75rem;
		color: var(--color-text);
	}

	textarea {
		resize: vertical;
	}

	.readonly {
		display: grid;
		gap: 0.25rem;
		border-radius: 0.75rem;
		background: var(--color-surface-muted);
		padding: 0.75rem;
	}

	code {
		overflow-wrap: anywhere;
		color: var(--color-text-muted);
		font-size: 0.8125rem;
	}

	@media (max-width: 1120px) {
		.shell {
			grid-template-columns: 18rem minmax(0, 1fr);
		}

		.detail {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 760px) {
		.shell {
			grid-template-columns: 1fr;
			padding: 1rem;
		}

		.project-header,
		.section-heading,
		.task-topline {
			display: grid;
		}
	}
</style>
