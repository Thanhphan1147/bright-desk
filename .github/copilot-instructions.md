# Copilot Instructions

## Project Goal

Bright Desk is a SvelteKit web application packaged as a strictly confined Snap. It manages a filesystem workspace of project folders, YAML task files, pending human decisions, and task-specific Git branch metadata for future background AI agents.

Use these source documents as implementation references:

- `spec/design-agent-task-workspace-web-app.md`
- `DESIGN.md`
- `TODO.md`

## Implementation Rules

- Keep code in this repository.
- Prefer small, feature-scoped changes that map to `TODO.md`.
- Preserve the YAML file contracts defined in the design specification.
- Treat workspace files as the source of truth.
- Validate all YAML-derived data at runtime before using or writing it.
- Use atomic writes for file mutations.
- Prevent path traversal and reject filesystem access outside the configured workspace.
- Keep unknown YAML fields when mutating known fields.
- Do not implement AI agent execution until the relevant feature task exists.
- Do not add application authentication for the MVP unless the specification changes.

## Testing Requirements

- Unit tests live with the codebase.
- Unit tests should strive for maximum practical coverage, especially for:
  - YAML schemas and validation.
  - Workspace path safety.
  - Project discovery and creation.
  - GitHub URL validation.
  - Task branch generation.
  - Checkout directory derivation.
  - Atomic file writes.
  - File version conflict detection.
  - Task, decision, and cleanup mutations.
- Do not mark implementation work as done until all unit tests pass.
- Add or update unit tests with every behavior change.

## E2E Validation Requirements

End-to-end validation is performed manually/agentically after packaging:

1. Repack the Snap.
2. Deploy or refresh the Snap on this host.
3. Verify the new functionality in the browser using the `chrome-dev-tools` MCP server.
4. A headless Chrome service is expected to already be running on this host. If it is not running, start it before validation.
5. Only mark work as done when both unit tests and the E2E validation pass.

The E2E validation should exercise the feature changed by the task and confirm that the browser UI works against the packaged Snap, not only the local development server.

## UI and Design Requirements

- Follow the Bright Desk design system in `DESIGN.md`.
- Use Tailwind CSS utilities for UI implementation and keep design tokens centralized in `src/app.css`.
- Keep the interface bright, minimal, calm, and precise.
- Pending decisions appear before tasks.
- Task cards show Git branch metadata.
- Task details show checkout directory metadata.
- Project creation requires a GitHub repository URL.
- Use direct labels such as `Create project`, `Add task`, `Answer decision`, `Refresh project`, and `Clean up completed`.

## Pull Request Expectations

- Keep PRs feature-scoped.
- Include a concise summary of the user-visible change.
- Include unit test results.
- Include E2E validation notes when a Snap package exists for the project.
