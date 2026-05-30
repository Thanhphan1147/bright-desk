# Bright Desk

Bright Desk is a minimal SvelteKit web application for managing AI-agent task workspaces from a browser. The MVP focuses on project discovery, YAML-backed tasks, pending human decisions, and task Git branch metadata.

The UI is implemented with Tailwind CSS using the Bright Desk tokens defined in `DESIGN.md` and mapped in `src/app.css`.

## Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
BRIGHT_DESK_WORKSPACE=/path/to/workspace
npm run dev
```

`BRIGHT_DESK_WORKSPACE` must point to an existing directory. Bright Desk refuses project file
operations outside that configured workspace and shows a visible state when the path is missing,
invalid, or inaccessible.

When installed as a Snap, Bright Desk defaults to `/home/workspace`. Create that host directory
before using the default, or override it with:

```sh
sudo mkdir -p /home/workspace
sudo snap set bright-desk workspace=/path/to/workspace
sudo snap restart bright-desk
```

Run validation:

```sh
npm run check
npm run lint
npm test
npm run build
```

## Project References

- `spec/design-agent-task-workspace-web-app.md`
- `DESIGN.md`
- `TODO.md`
- `.github/copilot-instructions.md`
- `docs/snap.md`
