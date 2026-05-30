# Snap Packaging

Bright Desk is packaged as a strictly confined Snap service.

## Build

Snap packages must be built with Snapcraft's LXD provider. Do not use destructive mode.

```sh
snapcraft pack --use-lxd
```

If LXD is not initialized on the host, initialize it before building:

```sh
sudo lxd init --auto
```

## Install or Refresh Locally

```sh
sudo snap install ./bright-desk_0.0.1_amd64.snap --dangerous
```

If the Snap is already installed:

```sh
sudo snap refresh ./bright-desk_0.0.1_amd64.snap --dangerous
```

## Configure

The service defaults to `127.0.0.1:3000` and stores workspace data in `$SNAP_COMMON/workspace`.

```sh
sudo snap set bright-desk host=127.0.0.1
sudo snap set bright-desk port=3000
sudo snap set bright-desk workspace=/var/snap/bright-desk/common/workspace
sudo snap restart bright-desk
```

The MVP does not include authentication. Keep the service bound to localhost, behind a VPN, or behind a trusted reverse proxy.

## Service Commands

```sh
snap services bright-desk
sudo snap logs bright-desk
sudo snap restart bright-desk
```

## Packaged E2E Validation

1. Repack the Snap.
2. Install or refresh the Snap locally.
3. Ensure the `bright-desk` service is active.
4. Open `http://127.0.0.1:3000` with the Chrome DevTools MCP server.
5. Verify that the Bright Desk shell renders and the visible UI matches the current feature being validated.
