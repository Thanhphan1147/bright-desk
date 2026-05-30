---
title: Agent Task Workspace Web Application Design
version: 0.1
date_created: 2026-05-30
last_updated: 2026-05-30
owner: Personal
tags: [design, architecture, sveltekit, snap, workspace, agents]
---

# Introduction

This specification defines the design for a minimal web application that manages a filesystem workspace containing project context, task lists, pending human decisions, and completed task archives for asynchronous background AI agent workflows.

The application does not run AI agents in the Minimum Viable Product (MVP). The MVP focuses on discovering projects, reading and writing project files, presenting ongoing tasks and pending decisions, and providing a browser-based user experience for adding tasks, updating tasks, and resolving decisions.

## 1. Purpose & Scope

The purpose of this specification is to define the requirements, constraints, interfaces, data contracts, acceptance criteria, and validation criteria for a personal web-based task workspace manager.

The intended audience is software engineers and AI coding agents implementing the application.

The application shall be implemented as a SvelteKit web application packaged as a strictly confined Snap. The application shall run on a headless server and be accessed through a browser.

### In Scope

- Discover projects located under a configured workspace directory.
- Allow the user to create a project and associate it with a GitHub repository URL.
- Render one tab or equivalent navigation item per project.
- Display ongoing tasks from `tasks.yaml`.
- Display pending human decisions from `pending_decisions.yaml`.
- Display each task's associated Git branch and expected repository checkout directory.
- Allow the user to create, update, and mark tasks as complete.
- Allow the user to answer or resolve pending decisions.
- Persist changes to YAML files in the project directories.
- Support Markdown files for long-form project context and general agent instructions.
- Package and run the application as a Snap with strict confinement.
- Provide a minimal browser-only user experience for personal use.

### Out of Scope

- Running, scheduling, monitoring, or terminating AI agents.
- Authentication and authorization for the MVP.
- Multi-user collaboration.
- Remote workspace management outside the Snap-accessible filesystem area.
- Database-backed persistence.
- Real-time cross-device collaboration.
- Cloud synchronization.
- Fine-grained role-based access control.

### Assumptions

- The application is for personal use.
- The application runs on a trusted headless server.
- The network exposure is controlled by the user through firewall, reverse proxy, VPN, or local network configuration.
- The workspace path is configured at deployment time or application startup.
- The workspace is located in a path accessible under strict Snap confinement.
- YAML files are the source of truth for task and decision state.
- Markdown files are the source of truth for long-form project and agent context.

## 2. Definitions

| Term                    | Definition                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| AI Agent                | A background autonomous process that works on a task asynchronously. AI agent execution is out of scope for the MVP.               |
| Completed Task          | A task that has reached a terminal status and may be moved from `tasks.yaml` to `completed_tasks.yaml`.                            |
| Decision                | A human input request created when an AI agent, or the user, identifies a blocker that requires human judgment.                    |
| GitHub Repository URL   | The canonical HTTPS URL of the GitHub repository associated with a project.                                                        |
| Headless Server         | A server without a local graphical desktop environment, accessed over the network.                                                 |
| MVP                     | Minimum Viable Product. The first useful release with the smallest complete feature set.                                           |
| Project                 | A subdirectory of the workspace containing project context and task state files.                                                   |
| Snap                    | A Linux application packaging format.                                                                                              |
| Strict Confinement      | Snap security mode that restricts filesystem and system access unless specific interfaces are granted.                             |
| Task                    | A unit of work intended to be picked up by a background AI agent or managed manually.                                              |
| Task Branch             | The Git branch associated with a task. Future agents shall work on the task by checking out the project repository on this branch. |
| Task Checkout Directory | The workspace directory where a future agent shall place the repository checkout for a specific task branch.                       |
| Workspace               | A configured root directory containing one or more project directories.                                                            |
| YAML                    | Human-readable structured data serialization format used for task and decision state.                                              |

## 3. Requirements, Constraints & Guidelines

### Functional Requirements

- **REQ-001**: The application shall load a configured workspace directory at startup.
- **REQ-002**: The application shall discover projects as immediate child directories of the workspace that contain at least one recognized project file.
- **REQ-003**: A recognized project file shall be one of `project.yaml`, `tasks.yaml`, `pending_decisions.yaml`, `completed_tasks.yaml`, or a `context/` directory.
- **REQ-004**: The application shall present discovered projects as tabs or equivalent top-level navigation items.
- **REQ-005**: The application shall allow the user to create a project from the UI.
- **REQ-006**: The create project UI shall require a project name and GitHub repository URL.
- **REQ-007**: The application shall validate the GitHub repository URL before creating a project.
- **REQ-008**: The application shall persist the GitHub repository URL in `project.yaml`.
- **REQ-009**: The application shall display the GitHub repository URL or a repository link in the selected project view.
- **REQ-010**: The application shall display active tasks for the selected project from `tasks.yaml`.
- **REQ-011**: The application shall display pending decisions for the selected project from `pending_decisions.yaml`.
- **REQ-012**: The application shall allow the user to create a task in the selected project.
- **REQ-013**: The create task UI shall require or generate a Git branch name for the task.
- **REQ-014**: The application shall persist each task's Git branch name in `tasks.yaml`.
- **REQ-015**: The application shall derive and display each task's expected checkout directory.
- **REQ-016**: The application shall allow the user to update editable fields of an existing task, including the Git branch while the task has not started.
- **REQ-017**: The application shall require explicit confirmation before changing the branch of a task in `in_progress`, `blocked`, `completed`, `failed`, or `cancelled` status.
- **REQ-018**: The application shall allow the user to change a task status.
- **REQ-019**: The application shall allow the user to answer or resolve a pending decision.
- **REQ-020**: The application shall persist task changes to `tasks.yaml`.
- **REQ-021**: The application shall persist decision changes to `pending_decisions.yaml`.
- **REQ-022**: The application shall create missing `tasks.yaml` and `pending_decisions.yaml` files when the user performs an operation that requires them.
- **REQ-023**: The application shall preserve unknown YAML fields when updating known fields.
- **REQ-024**: The application shall validate YAML files against explicit schemas before accepting user changes.
- **REQ-025**: The application shall surface validation errors in the user interface with actionable messages.
- **REQ-026**: The application shall perform atomic file writes using a temporary file followed by rename.
- **REQ-027**: The application shall detect when a file changed on disk after it was loaded and before it is overwritten.
- **REQ-028**: The application shall provide a manual refresh action for project data.
- **REQ-029**: The application should watch project files for external changes and refresh the displayed data when safe.
- **REQ-030**: The application shall provide a cleanup action that moves completed tasks from `tasks.yaml` to `completed_tasks.yaml`.
- **REQ-031**: The cleanup action shall preserve task IDs, timestamps, descriptions, results, Git branch metadata, checkout directory metadata, and unknown fields.
- **REQ-032**: The application shall not delete completed tasks automatically.
- **REQ-033**: The application shall bind to a configurable host and port.
- **REQ-034**: The default bind host shall avoid unintended public exposure.

### Security Requirements

- **SEC-001**: The MVP shall not implement application-level authentication.
- **SEC-002**: The application shall clearly document that network exposure must be controlled externally when authentication is disabled.
- **SEC-003**: The application shall restrict filesystem access to the configured workspace path.
- **SEC-004**: The application shall reject project paths that resolve outside the configured workspace path.
- **SEC-005**: The application shall protect against path traversal in all server-side file operations.
- **SEC-006**: The application shall not follow symlinks that resolve outside the workspace.
- **SEC-007**: The application shall not expose arbitrary file read or write APIs.
- **SEC-008**: The application shall not execute shell commands based on workspace file content.
- **SEC-009**: The application shall treat GitHub repository URLs as metadata only and shall not clone, fetch, or execute commands against the repository in the MVP.
- **SEC-010**: The application shall validate task branch names and checkout directory names before persisting them.

### Snap Packaging Requirements

- **SNP-001**: The application shall be packaged as a Snap.
- **SNP-002**: The Snap shall use strict confinement.
- **SNP-003**: The Snap shall document supported workspace locations under strict confinement.
- **SNP-004**: The Snap shall provide configuration for the workspace path.
- **SNP-005**: The Snap shall provide configuration for host and port.
- **SNP-006**: The Snap should run as a service suitable for a headless server.
- **SNP-007**: The Snap shall not require classic confinement for the MVP.

### Data Requirements

- **DAT-001**: Structured task state shall be stored in YAML.
- **DAT-002**: Structured decision state shall be stored in YAML.
- **DAT-003**: Long-form project context and general agent instructions should be stored in Markdown.
- **DAT-004**: Each task shall have a stable unique ID within its project.
- **DAT-005**: Each decision shall have a stable unique ID within its project.
- **DAT-006**: Timestamps shall use ISO 8601 format with timezone information.
- **DAT-007**: Task and decision status values shall use explicit enumerations.
- **DAT-008**: YAML files shall use a top-level object rather than a top-level array.
- **DAT-009**: Each project shall have exactly one GitHub repository URL in `project.yaml`.
- **DAT-010**: GitHub repository URLs shall use the `https://github.com/{owner}/{repo}` form, with an optional trailing slash.
- **DAT-011**: Each task shall have exactly one Git branch name.
- **DAT-012**: Task branch names shall be safe Git branch names and should use the `agent/{task-id}-{short-slug}` convention.
- **DAT-013**: Task checkout directories shall use the `checkouts/{task-id}--{branch-slug}` convention relative to the project directory.
- **DAT-014**: The `branch-slug` segment shall be derived from the branch name by replacing `/` with `-` and removing characters that are unsafe for directory names.

### User Experience Requirements

- **UXR-001**: The project navigation shall make it clear which project is selected.
- **UXR-002**: The selected project view shall show tasks and decisions without requiring navigation to separate pages.
- **UXR-003**: The user shall be able to add a task with a title and description from the selected project view.
- **UXR-004**: The user shall be able to answer a decision from the selected project view.
- **UXR-005**: Validation and write errors shall be visible near the action that caused them.
- **UXR-006**: The UI shall distinguish active, blocked, completed, and failed tasks.
- **UXR-007**: The UI shall distinguish unanswered, answered, and resolved decisions.
- **UXR-008**: The UI should provide a compact dashboard summary for each project.
- **UXR-009**: The create project form shall include a required GitHub repository URL field.
- **UXR-010**: The project header should include an external link to the associated GitHub repository.
- **UXR-011**: Task cards shall show the task branch name.
- **UXR-012**: Task detail and edit views shall show the expected checkout directory.
- **UXR-013**: The create task form shall include a branch name field with an autogenerated default.

### Constraints

- **CON-001**: The MVP shall use filesystem files as the persistence layer.
- **CON-002**: The MVP shall not require a database.
- **CON-003**: The MVP shall not require authentication.
- **CON-004**: The MVP shall not require agent execution capabilities.
- **CON-005**: The MVP shall support strict Snap confinement.
- **CON-006**: The application shall be browser-accessed and server-hosted, not a desktop application.

### Guidelines

- **GUD-001**: Prefer simple project conventions over complex configuration.
- **GUD-002**: Prefer explicit YAML schemas over free-form unvalidated YAML.
- **GUD-003**: Prefer stable IDs over position-based references.
- **GUD-004**: Prefer append-preserving archival behavior over destructive cleanup.
- **GUD-005**: Prefer small server-side modules with clear responsibilities.
- **GUD-006**: Prefer accessibility-first UI components.

### Recommended Architecture Pattern

- **PAT-001**: Use SvelteKit for the browser UI and server-side request handlers.
- **PAT-002**: Use a workspace service responsible for project discovery and path safety.
- **PAT-003**: Use a YAML repository service responsible for parse, validate, update, and atomic write operations.
- **PAT-004**: Use schema validation for every read and write boundary.
- **PAT-005**: Use optimistic concurrency based on file metadata or content hash.
- **PAT-006**: Keep all agent execution abstractions out of the MVP implementation, while preserving compatible file contracts.

## 4. Interfaces & Data Contracts

### Workspace Directory Contract

The configured workspace directory shall contain zero or more project directories.

```text
workspace/
  project-a/
    project.yaml
    context/
      overview.md
      instructions.md
    tasks.yaml
    pending_decisions.yaml
    completed_tasks.yaml
    checkouts/
      task-20260530-001--agent-task-20260530-001-build-dashboard/
  project-b/
    project.yaml
    tasks.yaml
    pending_decisions.yaml
```

### Project Metadata Contract

File: `project.yaml`

```yaml
schema_version: 1
id: project-a
name: Project A
description: Optional short project description.
status: active
github:
  url: https://github.com/example/project-a
created_at: 2026-05-30T17:53:42+02:00
updated_at: 2026-05-30T17:53:42+02:00
agent_instructions:
  primary_context_files:
    - context/overview.md
    - context/instructions.md
```

| Field                                      | Type            | Required | Description                                                        |
| ------------------------------------------ | --------------- | -------- | ------------------------------------------------------------------ |
| `schema_version`                           | integer         | Yes      | Schema version for the file.                                       |
| `id`                                       | string          | Yes      | Stable project ID.                                                 |
| `name`                                     | string          | Yes      | Display name.                                                      |
| `description`                              | string          | No       | Short project summary.                                             |
| `status`                                   | enum            | No       | `active`, `paused`, or `archived`.                                 |
| `github.url`                               | string          | Yes      | Canonical HTTPS GitHub repository URL associated with the project. |
| `created_at`                               | datetime string | No       | Creation timestamp.                                                |
| `updated_at`                               | datetime string | No       | Last update timestamp.                                             |
| `agent_instructions.primary_context_files` | string array    | No       | Relative Markdown context file paths.                              |

The `github.url` value shall match this normalized form:

```text
https://github.com/{owner}/{repo}
```

An optional trailing slash may be accepted on input, but the stored value should omit the trailing slash.

### Tasks Contract

File: `tasks.yaml`

```yaml
schema_version: 1
tasks:
  - id: task-20260530-001
    title: Build project dashboard
    status: pending
    priority: medium
    created_at: 2026-05-30T17:53:42+02:00
    updated_at: 2026-05-30T17:53:42+02:00
    description: |
      Create the initial dashboard for browsing projects, tasks, and decisions.
    git:
      branch: agent/task-20260530-001-build-dashboard
      checkout_dir: checkouts/task-20260530-001--agent-task-20260530-001-build-dashboard
    acceptance_criteria:
      - The user can see all discovered projects.
      - The user can select a project.
      - The user can see active tasks for the selected project.
    agent:
      assigned_to: null
      last_run_id: null
      blocked_by_decision_id: null
    result:
      summary: null
      artifacts: []
```

| Field                         | Type            | Required | Description                                                                 |
| ----------------------------- | --------------- | -------- | --------------------------------------------------------------------------- |
| `schema_version`              | integer         | Yes      | Schema version for the file.                                                |
| `tasks`                       | task array      | Yes      | List of active or recently completed tasks.                                 |
| `tasks[].id`                  | string          | Yes      | Stable task ID.                                                             |
| `tasks[].title`               | string          | Yes      | Short task title.                                                           |
| `tasks[].status`              | enum            | Yes      | `pending`, `in_progress`, `blocked`, `completed`, `failed`, or `cancelled`. |
| `tasks[].priority`            | enum            | No       | `low`, `medium`, `high`, or `urgent`.                                       |
| `tasks[].created_at`          | datetime string | Yes      | Creation timestamp.                                                         |
| `tasks[].updated_at`          | datetime string | Yes      | Last update timestamp.                                                      |
| `tasks[].description`         | string          | No       | Detailed task description.                                                  |
| `tasks[].git.branch`          | string          | Yes      | Git branch associated with the task.                                        |
| `tasks[].git.checkout_dir`    | string          | Yes      | Expected repository checkout directory relative to the project directory.   |
| `tasks[].acceptance_criteria` | string array    | No       | Completion criteria.                                                        |
| `tasks[].agent`               | object          | No       | Future agent execution metadata.                                            |
| `tasks[].result`              | object          | No       | Completion summary and artifacts.                                           |

### Task Branch and Checkout Contract

Every task shall be associated with one Git branch. Future agents shall check out the project's GitHub repository into the task checkout directory and work on that branch.

Branch naming convention:

```text
agent/{task-id}-{short-slug}
```

Checkout directory convention, relative to the project directory:

```text
checkouts/{task-id}--{branch-slug}
```

Example:

```yaml
id: task-20260530-001
title: Build project dashboard
git:
  branch: agent/task-20260530-001-build-dashboard
  checkout_dir: checkouts/task-20260530-001--agent-task-20260530-001-build-dashboard
```

The MVP shall not create or update this checkout directory automatically. The field exists so the UI and future agent runner share a stable contract.

### Pending Decisions Contract

File: `pending_decisions.yaml`

```yaml
schema_version: 1
decisions:
  - id: decision-20260530-001
    task_id: task-20260530-001
    status: pending
    question: Which UI layout should be used for project navigation?
    context: |
      The app can use tabs or a sidebar. Tabs match the original concept,
      while a sidebar scales better for many projects.
    options:
      - id: tabs
        label: Tabs
      - id: sidebar
        label: Sidebar
    answer:
      selected_option_id: null
      text: null
      answered_at: null
    created_at: 2026-05-30T17:53:42+02:00
    updated_at: 2026-05-30T17:53:42+02:00
```

| Field                    | Type            | Required | Description                                        |
| ------------------------ | --------------- | -------- | -------------------------------------------------- |
| `schema_version`         | integer         | Yes      | Schema version for the file.                       |
| `decisions`              | decision array  | Yes      | List of pending, answered, or resolved decisions.  |
| `decisions[].id`         | string          | Yes      | Stable decision ID.                                |
| `decisions[].task_id`    | string          | No       | Related task ID.                                   |
| `decisions[].status`     | enum            | Yes      | `pending`, `answered`, `resolved`, or `cancelled`. |
| `decisions[].question`   | string          | Yes      | The decision question.                             |
| `decisions[].context`    | string          | No       | Supporting context.                                |
| `decisions[].options`    | option array    | No       | Suggested answer options.                          |
| `decisions[].answer`     | object          | No       | Human answer.                                      |
| `decisions[].created_at` | datetime string | Yes      | Creation timestamp.                                |
| `decisions[].updated_at` | datetime string | Yes      | Last update timestamp.                             |

### Completed Tasks Contract

File: `completed_tasks.yaml`

```yaml
schema_version: 1
completed_tasks:
  - id: task-20260530-000
    title: Define initial workspace layout
    status: completed
    completed_at: 2026-05-30T17:53:42+02:00
    archived_at: 2026-05-30T17:53:42+02:00
    result:
      summary: Initial workspace layout documented.
      artifacts: []
```

### Server Route Interface

The implementation may use different internal route names, but it shall provide equivalent capabilities.

| Capability              | Method  | Route                                              | Description                                                                                                         |
| ----------------------- | ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| List projects           | `GET`   | `/api/projects`                                    | Return discovered projects with summary counts.                                                                     |
| Create project          | `POST`  | `/api/projects`                                    | Create a project directory and initial project files, including a required GitHub repository URL in `project.yaml`. |
| Get project             | `GET`   | `/api/projects/{projectId}`                        | Return project metadata, tasks, decisions, and file version metadata.                                               |
| Create task             | `POST`  | `/api/projects/{projectId}/tasks`                  | Add a task to `tasks.yaml`.                                                                                         |
| Update task             | `PATCH` | `/api/projects/{projectId}/tasks/{taskId}`         | Update editable task fields.                                                                                        |
| Resolve decision        | `PATCH` | `/api/projects/{projectId}/decisions/{decisionId}` | Store answer and update decision status.                                                                            |
| Cleanup completed tasks | `POST`  | `/api/projects/{projectId}/cleanup`                | Move completed tasks to `completed_tasks.yaml`.                                                                     |
| Refresh project         | `POST`  | `/api/projects/{projectId}/refresh`                | Reload project files from disk.                                                                                     |

### Concurrency Metadata Contract

Responses that expose editable file-backed data shall include file version metadata.

```json
{
	"fileVersions": {
		"tasks.yaml": {
			"mtimeMs": 1780156422000,
			"sha256": "hex-encoded-content-hash"
		},
		"pending_decisions.yaml": {
			"mtimeMs": 1780156422000,
			"sha256": "hex-encoded-content-hash"
		}
	}
}
```

Write operations shall include the last observed version metadata for the file being modified. If the current file version differs, the server shall reject the write with a conflict response.

## 5. Acceptance Criteria

- **AC-001**: Given a configured workspace with two valid project folders, When the application starts, Then both projects are shown as top-level navigation items.
- **AC-002**: Given a project with `tasks.yaml`, When the project is selected, Then the active tasks are displayed.
- **AC-003**: Given a project with `pending_decisions.yaml`, When the project is selected, Then pending decisions are displayed.
- **AC-004**: Given the create project form, When the user enters a project name and valid GitHub repository URL, Then the application creates the project directory and writes `project.yaml` with `github.url`.
- **AC-005**: Given the create project form, When the user omits the GitHub repository URL or enters a non-GitHub URL, Then the application displays a validation error and does not create the project.
- **AC-006**: Given a selected project, When the project header is displayed, Then the associated GitHub repository URL is available as an external link.
- **AC-007**: Given a selected project, When the user creates a task with a title and description, Then the task is appended to `tasks.yaml` with a stable ID and timestamps.
- **AC-008**: Given a selected project, When the user creates a task without manually entering a branch, Then the application generates a branch using `agent/{task-id}-{short-slug}` and persists it in `tasks.yaml`.
- **AC-009**: Given a task in `tasks.yaml`, When the task card is displayed, Then the branch name is visible.
- **AC-010**: Given a task in `tasks.yaml`, When the task detail view is displayed, Then the expected checkout directory is visible.
- **AC-011**: Given a task in `tasks.yaml`, When the user updates the task status, Then the task status and `updated_at` fields are persisted.
- **AC-012**: Given a pending decision, When the user submits an answer, Then the answer is written to `pending_decisions.yaml` and the decision status becomes `answered`.
- **AC-013**: Given invalid YAML in `tasks.yaml`, When the project is loaded, Then the UI displays a validation error and does not overwrite the file.
- **AC-014**: Given a file changed externally after the UI loaded it, When the user attempts to save a stale edit, Then the application rejects the edit and prompts the user to refresh.
- **AC-015**: Given completed tasks in `tasks.yaml`, When the cleanup action runs, Then completed tasks are moved to `completed_tasks.yaml` and removed from `tasks.yaml`.
- **AC-016**: Given a completed task with unknown custom fields, When cleanup runs, Then the unknown fields are preserved in `completed_tasks.yaml`.
- **AC-017**: Given a path traversal attempt in a project ID or file path, When the server receives the request, Then the server rejects it and performs no filesystem operation.
- **AC-018**: Given the Snap is installed with strict confinement, When the configured workspace is in a supported accessible location, Then the app can read and write project files.
- **AC-019**: Given the app is deployed without authentication, When it starts, Then deployment documentation clearly states that network access must be restricted externally.

## 6. Test Automation Strategy

### Test Levels

- **Unit Tests**:
  - YAML schema validation.
  - Project discovery.
  - Project creation and GitHub repository URL validation.
  - Path normalization and workspace boundary checks.
  - Task mutation logic.
  - Task branch generation and checkout directory derivation.
  - Decision mutation logic.
  - Cleanup logic.
  - File version conflict detection.

- **Integration Tests**:
  - API route behavior against temporary workspace directories.
  - Atomic write behavior.
  - Missing file creation.
  - Invalid YAML handling.
  - Snap configuration assumptions where practical.

- **End-to-End Tests**:
  - Project selection.
  - Project creation with required GitHub repository URL.
  - Task creation.
  - Task creation with autogenerated branch metadata.
  - Task status update.
  - Decision answer submission.
  - Cleanup action.

### Frameworks

- **Frontend and Server Unit Tests**: A JavaScript or TypeScript test runner compatible with SvelteKit.
- **End-to-End Tests**: Browser automation suitable for SvelteKit applications.
- **Schema Tests**: Direct tests of schema validators and representative YAML fixtures.

### Test Data Management

- Tests shall create temporary workspace directories.
- Tests shall write representative YAML and Markdown fixtures.
- Tests shall remove temporary workspace directories after execution.
- Tests shall include fixtures for valid files, missing files, invalid YAML, unknown fields, and stale file versions.

### CI/CD Integration

- Automated tests should run on every pull request or main branch update.
- Snap packaging validation should run before release artifacts are published.

### Coverage Requirements

- Critical filesystem safety logic shall have unit test coverage.
- YAML read, validation, mutation, and write flows shall have unit or integration test coverage.
- UI happy paths shall have end-to-end test coverage.

### Performance Testing

- The MVP shall be tested with at least 25 projects, 250 active tasks, and 250 pending decisions.
- The selected project view should remain responsive with 100 active tasks and 100 pending decisions in one project.

## 7. Rationale & Context

The application is intentionally file-based because the workspace files are meant to be readable and editable by humans and AI agents. YAML is selected for structured task and decision state because it supports readable multiline text and is more comfortable for human review than JSON. Markdown is selected for long-form context and instructions because it is readable, diffable, and suitable for natural-language guidance.

SvelteKit is selected because it provides a productive browser UI framework and server-side request handling in one application. This is appropriate for a headless server deployment where the browser is the only client.

Snap strict confinement is accepted as a constraint. This requires the workspace to live in a Snap-accessible location or use explicitly connected Snap interfaces. The MVP shall not require classic confinement.

Authentication is excluded from the MVP because the application is for personal use and deployment access can be restricted externally. This increases the importance of clear deployment documentation and safe default binding behavior.

Atomic writes and conflict detection are required because future AI agents may modify the same files as the UI. The MVP shall establish safe file mutation patterns even before agent execution exists.

Task branch and checkout metadata are included in the MVP file contracts even though repository checkout is out of scope. This ensures the human UI, YAML files, and future agent runner agree on where task-specific repository work will happen.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: Local filesystem - Stores workspace projects, YAML state files, and Markdown context files.
- **EXT-002**: Browser - Provides the user interface for personal task and decision management.

### Third-Party Services

- **SVC-001**: None required for the MVP.

### Infrastructure Dependencies

- **INF-001**: Headless Linux server - Hosts the Snap-packaged web application.
- **INF-002**: Network access control - Restricts browser access when application-level authentication is disabled.
- **INF-003**: Optional reverse proxy - May terminate TLS or restrict access, but is not required by the application design.

### Data Dependencies

- **DAT-DEP-001**: Workspace directory - Must be readable and writable by the Snap under strict confinement.
- **DAT-DEP-002**: Project YAML files - Must conform to the schemas defined in this specification or be reported as invalid.
- **DAT-DEP-003**: Context Markdown files - May be referenced by project metadata.
- **DAT-DEP-004**: Task checkout directories - Future agent-created repository checkouts located under each project directory using the specified naming convention.

### Technology Platform Dependencies

- **PLT-001**: Node.js runtime compatible with the selected SvelteKit adapter.
- **PLT-002**: SvelteKit web application framework.
- **PLT-003**: YAML parser and stringifier that can preserve object data without converting multiline text to unreadable formats.
- **PLT-004**: Schema validation library for runtime validation of YAML-derived data.
- **PLT-005**: File watching capability for detecting external workspace changes.
- **PLT-006**: Snapcraft packaging tooling.

### Compliance Dependencies

- **COM-001**: No formal compliance requirement is in scope for the MVP.

## 9. Examples & Edge Cases

### Minimal Project

```text
workspace/
  personal-site/
    tasks.yaml
    pending_decisions.yaml
```

```yaml
schema_version: 1
tasks: []
```

```yaml
schema_version: 1
decisions: []
```

### Task Blocked by Decision

```yaml
schema_version: 1
tasks:
  - id: task-20260530-002
    title: Choose deployment target
    status: blocked
    priority: high
    created_at: 2026-05-30T17:53:42+02:00
    updated_at: 2026-05-30T17:53:42+02:00
    description: Decide where the service should be hosted.
    git:
      branch: agent/task-20260530-002-choose-deployment-target
      checkout_dir: checkouts/task-20260530-002--agent-task-20260530-002-choose-deployment-target
    agent:
      assigned_to: null
      last_run_id: null
      blocked_by_decision_id: decision-20260530-002
```

```yaml
schema_version: 1
decisions:
  - id: decision-20260530-002
    task_id: task-20260530-002
    status: pending
    question: Should the service bind only to localhost?
    options:
      - id: localhost
        label: Bind to localhost only
      - id: private-network
        label: Bind to private network interface
    created_at: 2026-05-30T17:53:42+02:00
    updated_at: 2026-05-30T17:53:42+02:00
```

### Invalid YAML Edge Case

If `tasks.yaml` cannot be parsed, the application shall:

1. Display a project-level error.
2. Disable writes that would overwrite `tasks.yaml`.
3. Allow the user to refresh after manually fixing the file.
4. Continue loading other valid files where possible.

### Missing File Edge Case

If `pending_decisions.yaml` is missing, the application shall treat the decision list as empty for display purposes. If the user creates or updates a decision, the application shall create the file with this structure:

```yaml
schema_version: 1
decisions: []
```

### Workspace Boundary Edge Case

If a project ID resolves to `../other-directory`, the application shall reject the request before reading or writing any file.

## 10. Validation Criteria

- **VAL-001**: The implementation provides a browser-accessible SvelteKit app.
- **VAL-002**: The implementation can be packaged as a strictly confined Snap.
- **VAL-003**: The implementation can load a configured workspace path.
- **VAL-004**: The implementation discovers project directories from the workspace.
- **VAL-005**: The implementation displays project tasks and decisions.
- **VAL-006**: The implementation can create and update tasks in `tasks.yaml`.
- **VAL-007**: The implementation persists and displays task branch metadata.
- **VAL-008**: The implementation derives and displays task checkout directories using the specified naming convention.
- **VAL-009**: The implementation can answer decisions in `pending_decisions.yaml`.
- **VAL-010**: The implementation can move completed tasks to `completed_tasks.yaml`.
- **VAL-011**: The implementation validates YAML files before writes.
- **VAL-012**: The implementation preserves unknown fields during edits.
- **VAL-013**: The implementation uses atomic writes.
- **VAL-014**: The implementation detects stale writes.
- **VAL-015**: The implementation rejects filesystem access outside the configured workspace.
- **VAL-016**: The implementation documents that MVP authentication is not included.
- **VAL-017**: The implementation documents safe deployment recommendations for a no-authentication headless server.

## 11. Related Specifications / Further Reading

- SvelteKit documentation: https://svelte.dev/docs/kit
- Snapcraft documentation: https://snapcraft.io/docs
- YAML 1.2 specification: https://yaml.org/spec/1.2.2/
- Markdown Guide: https://www.markdownguide.org/
