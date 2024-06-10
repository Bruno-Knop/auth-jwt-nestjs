import * as fs from 'fs';
import * as path from 'path';

function incrementVersion(version: string): string {
  const [major, minor, patch] = version.split('.').map(Number);
  const newPatch = patch + 1;
  return `${major}.${minor}.${newPatch}`;
}

const buildDate = new Date().toLocaleString('pt-BR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const envFilePath = path.join(__dirname, '..', '.env');

let envFileContent = '';
if (fs.existsSync(envFilePath)) {
  envFileContent = fs.readFileSync(envFilePath, 'utf-8');
}

const versionMatch = envFileContent.match(/APP_VERSION=(\d+\.\d+\.\d+)/);
const currentVersion = versionMatch ? versionMatch[1] : '0.0.0';

const newVersion = incrementVersion(currentVersion);

const newEnvFileContent = envFileContent
  .replace(/APP_BUILD_DATE=.*/g, `APP_BUILD_DATE=${buildDate}`)
  .replace(/APP_VERSION=.*/g, `APP_VERSION=${newVersion}`);

fs.writeFileSync(envFilePath, newEnvFileContent.trim());

console.log(`APP_BUILD_DATE updated to: ${buildDate}`);
console.log(`APP_VERSION updated to: ${newVersion}`);
