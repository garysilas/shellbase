import { AppShell } from './components/shell/AppShell';

const fallbackVersions = {
  electron: 'unavailable',
  chrome: 'unavailable',
  node: 'unavailable',
} as const;

const appName = 'Shellbase';

export const App = () => {
  const shellbaseApi = window.shellbase;
  const platform = shellbaseApi?.getPlatform?.() ?? 'desktop';
  const versions = shellbaseApi?.getVersions?.() ?? fallbackVersions;

  return <AppShell appName={appName} platform={platform} versions={versions} />;
};
