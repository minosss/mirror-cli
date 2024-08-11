# @yme/mirror-cli

[![NPM version](https://img.shields.io/npm/v/@yme/mirror-cli)](https://www.npmjs.com/package/@yme/mirror-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/@yme/mirror-cli)](https://www.npmjs.com/package/@yme/mirror-cli)

CLI for setting npm and electron mirror.

> This is an ESM package. Node.js >= 18 is recommended.

### Install

```sh
pnpm -g add @yme/mirror-cli
```

### Usage

```
mirror <command> <options>

# Get current mirror of npm
mirror current --npm

# Set mirror of npm to tencent (project, save to <project>/.npmrc)
mirror use tencent --npm

# Set mirror of user (user, save to ~/.npmrc)
mirror use tencent --npm --global

# Set mirror of npm and electron
mirror use taobao --npm --electron

# Custom mirror (start with https)
mirror use https://your.domain.com --npm

# NPM
Pass --global option will not set location to "global", "project" by default

Commands

help        Print usage
current     List currently used mirrors
list        List of available mirrors
use         Update mirror, key of available mirrors OR custom mirror url

Options

--npm       node package manager
--electron  electron project
--global    location of config, false by default
```

### License

MIT
