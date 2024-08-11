import parser from '@yme/argv';
import * as npm_ from './npm.js';
import * as electron_ from './electron.js';
import { hasPackageFile, logger } from './utils.js';

const HELP = `
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
`;


function runIf(scope, fn) {
  if (scope) {
    const log = logger(scope);
    fn(log);
  }
}

const NPM_SCOPE = '\u001B[31mnpm\u001B[39m';
const ELECTRON_SCOPE = '\u001B[36melectron\u001B[39m';

function printList(log, list) {
  log('List of available mirrors');
  for (const key in list) {
    if (Object.hasOwnProperty.call(list, key)) {
      const element = list[key];
      if (!element) continue;

      log(`--- ${key} ---`);
      log(`Name: ${element.name}`);
      log(`Home: ${element.url}`);
      log(`Mirror: ${element.value}`);
    }
  }
}

export default async function main(args = []) {
  const argv = parser(args);
  const [command = 'help'] = argv._;

  let {
    // -
    electron,
    npm,
    global = false,
  } = argv;

  if (command === 'help') {
    console.log(HELP);
    return;
  }

  if (npm !== true && electron !== true) {
    logger(NPM_SCOPE)('Enable');
    npm = hasPackageFile();
  }

  const hasNpm = npm && NPM_SCOPE;
  const hasElectron = electron && ELECTRON_SCOPE;

  if (command === 'current') {
    runIf(hasNpm, (log) => log(`Current mirror is: ${npm_.get()}`));
    runIf(hasElectron, (log) => log(`Current mirror is: ${electron_.get()}`));
    return;
  }

  if (command === 'list') {
    runIf(hasNpm, (log) => printList(log, npm_.list()));
    runIf(hasElectron, (log) => printList(log, electron_.list()));
    return;
  }

  if (command === 'use') {
    const [_, mirror] = argv._;

    if (!mirror) throw new Error('Missing mirror');

    const applyMirror = (log, update) => {
      try {
        log(`Update ${global ? 'user' : 'project'} mirror to ${mirror}`);
        update(mirror, global);
        log('Success');
      } catch (error) {
        log(`Fail: ${error.message}`);
      }
    };

    runIf(hasNpm, (log) =>
      npm_.support(mirror)
        ? applyMirror(log, npm_.update)
        : log(`Don't support ${mirror}, skip`),
    );
    runIf(hasElectron, (log) =>
      npm_.support(mirror)
        ? applyMirror(log, electron_.update)
        : log(`Don't support ${mirror}, skip`),
    );
    return;
  }

  console.log(HELP);
}
