import { execSync } from 'node:child_process';

const runBuild = () => {
  execSync('corepack pnpm build', {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
};

const globalSetup = async () => {
  runBuild();
};

export default globalSetup;
