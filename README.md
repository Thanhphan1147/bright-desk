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
npm run dev
```

Run validation:

```sh
npm run check
npm run test -- --run
npm run build
```

## Project References

- `spec/design-agent-task-workspace-web-app.md`
- `DESIGN.md`
- `TODO.md`
- `.github/copilot-instructions.md`
