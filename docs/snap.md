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
sudo snap install --dangerous ./bright-desk_0.0.1_amd64.snap
```

## Configure

The service defaults to `0.0.0.0:3300` and uses `/home/workspace` as the workspace path.
The Snap exposes `host`, `port`, and `workspace` configuration keys for deployments that need
different values.

Create `/home/workspace` on the host before using the default workspace. Under strict confinement,
the service can use that directory through the `home` interface but does not create it automatically.

Strict Snap confinement does not allow this daemon to switch to an arbitrary host user from inside
the wrapper. Keep the workspace directory permissions aligned with the deployed Snap service and
restrict network access externally because the MVP has no authentication.

```sh
sudo mkdir -p /home/workspace
sudo snap set bright-desk host=0.0.0.0
sudo snap set bright-desk port=3300
sudo snap set bright-desk workspace=/home/workspace
sudo snap restart bright-desk
```

The MVP does not include authentication. When binding to `0.0.0.0`, expose the service only on a trusted network, behind a VPN, or behind a trusted reverse proxy.

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
4. Open `http://127.0.0.1:3300` with the Chrome DevTools MCP server.
5. Verify that the Bright Desk shell renders and the visible UI matches the current feature being validated.
