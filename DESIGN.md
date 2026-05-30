# Bright Desk Design System

## Purpose

Bright Desk is the visual design system for a minimal browser-based application that manages AI-agent task workspaces. The interface must feel calm, bright, precise, and modern. It should help a human quickly review active work, answer pending decisions, and edit task files without feeling like a heavy project-management tool.

## Design Principles

- **Minimal by default**: Use restrained surfaces, typography, and controls. Avoid decorative UI that does not improve comprehension.
- **Decisions first**: Pending human decisions are the highest-priority objects in the interface and should be visually privileged.
- **Calm operational clarity**: The app should feel like a clean command desk, not a noisy kanban board.
- **Filesystem honesty**: Validation errors, stale files, refresh states, and write conflicts must be visible and understandable.
- **Color with purpose**: Use color sparingly for status, attention, and action. Do not use color as decoration only.
- **Accessible personal tooling**: Maintain strong contrast, visible focus states, keyboard access, and text labels for statuses.

## Visual Tone

The product should feel:

- Bright
- Clean
- Quiet
- Precise
- Lightweight
- Trustworthy
- Slightly technical

The product should not feel:

- Corporate SaaS-heavy
- Dark cyberpunk
- Gradient-driven
- Playful or toy-like
- Dense like Jira
- Decorative before functional

## Color Palette

### Core Colors

| Token                   | Value     | Usage                                        |
| ----------------------- | --------- | -------------------------------------------- |
| `--color-bg`            | `#fbfaf7` | App background; warm off-white.              |
| `--color-surface`       | `#ffffff` | Cards, panels, forms, menus.                 |
| `--color-surface-muted` | `#f3f1eb` | Secondary surfaces and subtle grouped areas. |
| `--color-border`        | `#dedbd2` | Default borders and dividers.                |
| `--color-text`          | `#1f2523` | Primary text.                                |
| `--color-text-muted`    | `#66706b` | Secondary text, metadata, helper text.       |

### Action and Semantic Colors

| Token                   | Value     | Usage                                          |
| ----------------------- | --------- | ---------------------------------------------- |
| `--color-primary`       | `#246bfe` | Primary actions, selected navigation, links.   |
| `--color-primary-soft`  | `#e8efff` | Primary action background tint.                |
| `--color-decision`      | `#0f8b8d` | Pending decisions and human-input moments.     |
| `--color-decision-soft` | `#e4f6f6` | Decision card tint and decision chips.         |
| `--color-success`       | `#168a5b` | Completed tasks, successful saves.             |
| `--color-success-soft`  | `#e8f6ef` | Success chip background.                       |
| `--color-warning`       | `#b7791f` | Blocked tasks, stale files, pending attention. |
| `--color-warning-soft`  | `#fff4d8` | Warning chip or alert background.              |
| `--color-danger`        | `#c2413a` | Errors, failed tasks, destructive actions.     |
| `--color-danger-soft`   | `#fdebea` | Error chip or alert background.                |
| `--color-focus`         | `#ffb703` | Keyboard focus ring.                           |

### Tailwind Token Baseline

Bright Desk uses Tailwind CSS as the implementation styling framework. Design tokens from this document should be mapped into Tailwind v4 theme tokens in `src/app.css`.

```css
@theme {
	--color-paper: #fbfaf7;
	--color-surface: #ffffff;
	--color-surface-muted: #f3f1eb;
	--color-border: #dedbd2;
	--color-ink: #1f2523;
	--color-muted: #66706b;
	--color-primary: #246bfe;
	--color-primary-soft: #e8efff;
	--color-decision: #0f8b8d;
	--color-decision-soft: #e4f6f6;
	--color-success: #168a5b;
	--color-success-soft: #e8f6ef;
	--color-warning: #b7791f;
	--color-warning-soft: #fff4d8;
	--color-danger: #c2413a;
	--color-danger-soft: #fdebea;
	--color-focus: #ffb703;
}
```

## Typography

### Recommended Font Stack

- **Primary UI font**: Atkinson Hyperlegible Next
- **Fallback UI fonts**: Atkinson Hyperlegible, Source Sans 3, system sans-serif
- **Monospace font**: JetBrains Mono or IBM Plex Mono

### Usage

- Use the primary UI font for all navigation, labels, cards, and forms.
- Use the monospace font only for task IDs, decision IDs, timestamps, filenames, and technical metadata.
- Avoid decorative display fonts.
- Avoid using all caps except for very small metadata labels.

### Type Scale

| Token        | Size       | Line Height | Usage                                   |
| ------------ | ---------- | ----------- | --------------------------------------- |
| `--text-xs`  | `0.75rem`  | `1rem`      | Metadata, IDs, timestamps.              |
| `--text-sm`  | `0.875rem` | `1.25rem`   | Labels, helper text, compact controls.  |
| `--text-md`  | `1rem`     | `1.5rem`    | Body text and form fields.              |
| `--text-lg`  | `1.125rem` | `1.625rem`  | Card titles.                            |
| `--text-xl`  | `1.375rem` | `1.875rem`  | Page and project headings.              |
| `--text-2xl` | `1.75rem`  | `2.25rem`   | Main dashboard heading, used sparingly. |

## Layout

### Primary Application Shell

The preferred MVP layout is:

```text
Left sidebar: project navigation and counts
Main column: pending decisions first, active tasks second
Detail panel or modal: create/edit task, answer decision
```

Tabs are acceptable only when the number of projects is small. A sidebar is preferred because it scales better and keeps the main workspace stable.

### Spacing

Use an 8px spacing rhythm.

| Token        | Value     | Usage                       |
| ------------ | --------- | --------------------------- |
| `--space-1`  | `0.25rem` | Tight inline gaps.          |
| `--space-2`  | `0.5rem`  | Chip padding, compact gaps. |
| `--space-3`  | `0.75rem` | Form field gaps.            |
| `--space-4`  | `1rem`    | Card padding, section gaps. |
| `--space-6`  | `1.5rem`  | Major layout gaps.          |
| `--space-8`  | `2rem`    | Page-level spacing.         |
| `--space-12` | `3rem`    | Large empty states.         |

### Surfaces

- Use the warm background for the page.
- Use white cards for tasks, decisions, forms, and panels.
- Use subtle borders instead of heavy shadows.
- Use shadow only for overlays, menus, and modals.
- Use a subtle paper-grid or dotted background texture only if it remains barely visible.

## Components

### Project Navigation Item

Project navigation items should include:

- Project name
- Optional short description
- GitHub repository owner/name when space allows
- Pending decision count
- Active task count
- Blocked task count when greater than zero

Selected project state:

- White or primary-soft background
- Primary left border or small indicator
- Stronger text color

### Project Header

The selected project header should include:

- Project name
- Short project description
- External GitHub repository link
- Pending decision count
- Active task count
- Blocked task count when greater than zero
- Actions: `Refresh project`, `Add task`

The GitHub repository link should be visually quiet. It should use monospace styling only for compact owner/repository metadata, for example `owner/repo`, and it should open the full repository URL in a new browser tab.

### Create Project Form

The create project form is part of the MVP.

Required fields:

- Project name
- GitHub repository URL

Optional fields:

- Description
- Project directory name, if the generated directory name needs to be overridden

Requirements:

- The GitHub repository URL field must be required.
- The field label should be `GitHub repository URL`.
- Helper text should explain the expected format: `https://github.com/owner/repo`.
- Validation errors should appear next to the field.
- The primary action label should be `Create project`.
- The form should not imply that the app will clone or fetch the repository in the MVP.

### Create Task Form

The create task form should include branch metadata because every task maps to a repository branch.

Required fields:

- Task title
- Description
- Git branch

Optional fields:

- Priority
- Acceptance criteria

Requirements:

- The Git branch field should be prefilled with an autogenerated value using `agent/{task-id}-{short-slug}`.
- The field label should be `Git branch`.
- Helper text should explain that future agents will check out the repository on this branch.
- The expected checkout directory should be shown as read-only metadata using the `checkouts/{task-id}--{branch-slug}` convention.
- Branch and checkout metadata should use monospace styling.
- Changing a branch for a started task should require a clear confirmation state.

### Decision Card

Decision cards are priority objects.

Requirements:

- Appear above task cards.
- Use a subtle decision accent.
- Display the question prominently.
- Display related task ID when available.
- Display options as buttons or radio choices when options are provided.
- Allow free-text answers.
- Show clear `Answer decision` action.

Recommended styling:

- White card
- Thin teal top border or left border
- `decision-soft` chip for status
- No heavy fill unless the card requires attention

### Task Card

Task cards should be compact but readable.

Required content:

- Title
- Status chip
- Priority chip when set
- Git branch in compact monospace styling
- Short description preview
- Updated timestamp
- Expected checkout directory in task detail views
- Related blocked decision if present

Task cards should not use fully colored backgrounds. Use status chips and small accents instead.

Branch metadata should be visible but secondary. Prefer a compact row such as:

```text
branch agent/task-20260530-001-build-dashboard
checkout checkouts/task-20260530-001--agent-task-20260530-001-build-dashboard
```

On compact cards, show the branch and reserve the checkout path for expanded detail panels or tooltips.

### Status Chips

Use chips for status, never color-only indicators.

| Status        | Color         |
| ------------- | ------------- |
| `pending`     | Muted neutral |
| `in_progress` | Primary       |
| `blocked`     | Warning       |
| `completed`   | Success       |
| `failed`      | Danger        |
| `cancelled`   | Muted neutral |
| `answered`    | Decision      |
| `resolved`    | Success       |

### Forms

Forms should be simple and direct.

- Labels are always visible.
- Helper text is allowed when it prevents ambiguity.
- Multiline fields should be comfortable for task descriptions and decision answers.
- Save buttons should clearly indicate success, conflict, or validation failure.

### Empty States

Empty states should be quiet and useful.

Examples:

- "No pending decisions."
- "No active tasks."
- "This project has no task file yet. Add a task to create one."

Avoid whimsical illustrations for the MVP.

### Error and Conflict States

The app must clearly distinguish:

- Invalid YAML
- Failed write
- Stale file conflict
- Workspace path error
- Snap filesystem permission issue

Conflict messages should explain the next action, usually refresh before editing.

## Motion

Use restrained motion only.

Recommended:

- 120ms to 180ms transitions for hover and focus.
- 160ms to 220ms fade or slide for opening panels.
- Brief success confirmation after saving.
- Gentle expansion for warnings.

Avoid:

- Bounce animations
- Long page transitions
- Decorative animated backgrounds
- Motion that delays task completion

## Accessibility

Requirements:

- All interactive controls must be keyboard accessible.
- Focus states must be clearly visible using `--color-focus`.
- Status must be communicated by text, not color alone.
- Form inputs must have associated labels.
- Error messages must be programmatically associated with the relevant field where practical.
- Contrast must be sufficient for text, chips, borders, and focus states.
- Motion must respect reduced-motion preferences.

## Content Style

Use direct, concise language.

Preferred labels:

- "Add task"
- "Create project"
- "Git branch"
- "Checkout directory"
- "Answer decision"
- "Mark complete"
- "Refresh project"
- "Clean up completed"
- "File changed on disk"
- "Invalid YAML"

Avoid:

- Overly playful labels
- Ambiguous labels like "Submit"
- Agent-themed jargon in primary UI controls

## Implementation Tokens

```css
@theme {
	--font-sans:
		'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', 'Source Sans 3', system-ui, sans-serif;
	--font-mono: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;

	--radius-sm: 0.375rem;
	--radius-md: 0.625rem;
	--radius-lg: 0.875rem;
	--radius-xl: 1.25rem;

	--shadow-overlay: 0 18px 60px rgb(31 37 35 / 14%);

	--transition-fast: 120ms ease;
	--transition-base: 180ms ease;
}
```

## MVP Design Decisions

The following decisions are settled for the MVP:

- Use a bright light theme.
- Use Tailwind CSS utilities for implementation styling.
- Use a warm off-white app background.
- Use white cards and subtle borders.
- Use a left sidebar for project navigation unless project count is guaranteed to remain very small.
- Ask for a GitHub repository URL when creating a project.
- Show the GitHub repository link in the selected project header.
- Associate every task with a Git branch.
- Show task branch metadata on task cards.
- Show expected checkout directory metadata in task detail views.
- Show pending decisions before tasks.
- Use YAML and Markdown file states honestly in the UI.
- Use no authentication in the MVP.
- Avoid dark mode in the MVP unless it is trivial and does not compromise the light theme.

## Open Decisions

No design decision blocks the MVP.

The following can be decided later:

- Whether to support a dark theme.
- Whether to use tabs instead of a sidebar for very small workspaces.
- Whether to add a permanent right-side detail panel or use modal dialogs for editing.
- Whether to add a subtle background texture.
- Whether to support custom project colors.
