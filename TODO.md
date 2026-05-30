# MVP Implementation TODO

Goal: build the smallest useful version of Bright Desk that can manage this project through its own UI. Work is split into feature-scoped steps. Each step should leave the app in a runnable, testable state.

## Step 0 - Bootstrap the App

- [ ] Create the SvelteKit application scaffold.
- [ ] Configure TypeScript, formatting, linting, and test scripts using the default project conventions.
- [ ] Add Tailwind CSS and the Bright Desk design tokens from `DESIGN.md`.
- [ ] Add a minimal app shell with sidebar, main content area, and right-side detail panel placeholder.
- [ ] Add a local development command that starts the browser UI.

**Done when:** the app runs locally and shows the Bright Desk shell with static placeholder content.

## Step 1 - Snap Packaging

- [x] Add Snap packaging configuration.
- [x] Package the SvelteKit app as a service suitable for a headless server.
- [x] Use strict confinement.
- [x] Require LXD-based Snapcraft builds and prohibit destructive mode.
- [x] Document supported workspace locations under strict confinement.
- [x] Expose Snap configuration for workspace path, host, and port.
- [x] Document that MVP authentication is not included and network access must be restricted externally.
- [x] Add a repeatable packaged E2E validation flow using the Snap and Chrome DevTools MCP.

**Done when:** the app can be installed and run as a strictly confined Snap, and the static Bright Desk shell can be verified through the packaged deployment.

## Step 2 - Workspace Configuration

- [ ] Add server-side configuration for the workspace path.
- [ ] Support configuration through environment variable first.
- [ ] Validate that the workspace path exists and is a directory.
- [ ] Restrict all project file operations to paths inside the configured workspace.
- [ ] Add visible UI states for missing workspace, inaccessible workspace, and invalid workspace path.

**Done when:** the app can start against a configured workspace directory and safely refuses invalid paths.

## Step 3 - YAML Schemas and File Repository

- [ ] Define runtime schemas for `project.yaml`.
- [ ] Define runtime schemas for `tasks.yaml`.
- [ ] Define runtime schemas for `pending_decisions.yaml`.
- [ ] Define runtime schemas for `completed_tasks.yaml`.
- [ ] Implement YAML read, parse, validate, and serialize helpers.
- [ ] Implement atomic write using temporary file plus rename.
- [ ] Implement file version metadata using mtime and content hash.
- [ ] Preserve unknown fields when mutating known task, decision, and project fields.

**Done when:** tests can read, validate, update, and atomically write representative project YAML files without losing unknown fields.

## Step 4 - Project Discovery and Project Creation

- [ ] Discover immediate child directories of the workspace as projects.
- [ ] Recognize projects containing `project.yaml`, `tasks.yaml`, `pending_decisions.yaml`, `completed_tasks.yaml`, or `context/`.
- [ ] Implement `GET /api/projects`.
- [ ] Implement `POST /api/projects`.
- [ ] Require project name and GitHub repository URL when creating a project.
- [ ] Validate and normalize GitHub URLs to `https://github.com/{owner}/{repo}`.
- [ ] Create initial `project.yaml`, `tasks.yaml`, `pending_decisions.yaml`, and `completed_tasks.yaml`.
- [ ] Add create-project UI with required GitHub repository URL field.
- [ ] Show the GitHub repository link in the selected project header.

**Done when:** the UI can create and list a project linked to a GitHub repository.

## Step 5 - Self-Hosting Workspace Seed

- [ ] Create a workspace project entry for Bright Desk itself.
- [ ] Set the GitHub repository URL for this project.
- [ ] Add initial context files that reference `spec/design-agent-task-workspace-web-app.md`, `DESIGN.md`, and this `TODO.md`.
- [ ] Add initial tasks from the remaining TODO steps into the project's `tasks.yaml`.
- [ ] Ensure each seeded task has a generated branch and checkout directory.

**Done when:** Bright Desk appears as a project in its own UI and the remaining implementation work is visible as tasks.

## Step 6 - Task Listing and Task Creation

- [ ] Implement `GET /api/projects/{projectId}` for project metadata, tasks, decisions, and file versions.
- [ ] Display active tasks in the selected project view.
- [ ] Show task status, priority, updated timestamp, Git branch, and blocked decision reference.
- [ ] Implement `POST /api/projects/{projectId}/tasks`.
- [ ] Generate stable task IDs.
- [ ] Generate default task branches using `agent/{task-id}-{short-slug}`.
- [ ] Generate checkout directories using `checkouts/{task-id}--{branch-slug}`.
- [ ] Add create-task UI with title, description, priority, acceptance criteria, and Git branch field.
- [ ] Show checkout directory as read-only metadata.

**Done when:** the UI can create a task and immediately show its branch and checkout directory.

## Step 7 - Task Editing and Status Changes

- [ ] Implement `PATCH /api/projects/{projectId}/tasks/{taskId}`.
- [ ] Allow editing title, description, priority, acceptance criteria, and branch for not-started tasks.
- [ ] Require explicit confirmation before changing the branch of started or terminal tasks.
- [ ] Allow status changes between `pending`, `in_progress`, `blocked`, `completed`, `failed`, and `cancelled`.
- [ ] Update `updated_at` on every task mutation.
- [ ] Reject stale writes when file version metadata does not match.
- [ ] Display conflict errors with a refresh action.

**Done when:** the UI can safely edit tasks and update task status without overwriting external YAML changes.

## Step 8 - Pending Decisions

- [ ] Display pending decisions above tasks.
- [ ] Show decision status, related task ID, question, context, and options.
- [ ] Implement `PATCH /api/projects/{projectId}/decisions/{decisionId}`.
- [ ] Allow answering a decision with selected option and/or free-text answer.
- [ ] Change answered decisions to `answered`.
- [ ] Update `updated_at` and `answered_at` when answering.
- [ ] Surface YAML validation and stale write errors near the decision form.

**Done when:** the UI can answer a pending decision and persist the answer to `pending_decisions.yaml`.

## Step 9 - Cleanup Completed Tasks

- [ ] Implement `POST /api/projects/{projectId}/cleanup`.
- [ ] Move completed tasks from `tasks.yaml` to `completed_tasks.yaml`.
- [ ] Preserve task IDs, timestamps, result fields, Git branch metadata, checkout directory metadata, and unknown fields.
- [ ] Never delete completed tasks automatically.
- [ ] Add `Clean up completed` UI action.
- [ ] Show a clear success or conflict result after cleanup.

**Done when:** completed tasks can be archived without data loss.

## Step 10 - File Watching and Refresh

- [ ] Add manual `Refresh project` behavior.
- [ ] Add file watching for project YAML files where supported.
- [ ] Refresh displayed data when files change and there is no unsaved edit.
- [ ] Show `File changed on disk` banner when external changes conflict with the current view.
- [ ] Keep invalid YAML visible as a project-level error and prevent overwrites.

**Done when:** external edits to project YAML are detected and handled safely.

## Step 11 - MVP Polish and Validation

- [ ] Apply the Stitch dashboard reference from `.stitch/designs/bright-desk-dashboard-git-metadata.png`.
- [ ] Verify keyboard navigation for project selection, task creation, task editing, and decision answering.
- [ ] Verify visible focus states and status labels.
- [ ] Test with at least one project, five tasks, two pending decisions, and one completed task.
- [ ] Test invalid YAML, stale writes, missing files, and path traversal attempts.
- [ ] Update documentation for local development, workspace layout, and Snap deployment.

**Done when:** Bright Desk can manage its own implementation tasks from the browser UI and the remaining work can be tracked in the app itself.
