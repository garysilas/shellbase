import { useAppStore } from './store/app-store';
import { AppShell } from './components/shell/AppShell';

const fallbackVersions = {
  electron: 'unavailable',
  chrome: 'unavailable',
  node: 'unavailable',
} as const;

export const App = () => {
  const title = useAppStore((state) => state.title);
  const shellbaseApi = window.shellbase;
  const platform = shellbaseApi?.getPlatform?.() ?? 'desktop';
  const versions = shellbaseApi?.getVersions?.() ?? fallbackVersions;

  return (
    <AppShell appName={title} platform={platform} versions={versions} />
  );
};
