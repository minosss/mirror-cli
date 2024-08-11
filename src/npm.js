import { execSync } from 'node:child_process';
import { npm as mirrors } from './mirrors.js';

export function update(mirror = 'default', global = false) {
  const isUrlLike = mirror.startsWith('https');
  if (isUrlLike === false && mirrors[mirror] == null) { throw new Error(`Do not support mirror ${mirror}`); }

  const registry = isUrlLike ? mirror : mirrors[mirror].value;
  return execSync(`npm set registry=${registry} --location=${global ? 'user' : 'project'}`, {
    encoding: 'utf8',
  });
}

export function get() {
  return execSync('npm get registry', { encoding: 'utf8' });
}

export function list() {
  return mirrors;
}

export function support(mirror) {
  return mirrors[mirror] != null;
}
