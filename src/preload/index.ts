import { contextBridge } from 'electron';
import type { ShellbaseApi } from '../shared/shellbase-api';

const shellbaseApi: ShellbaseApi = {
  getPlatform: () => process.platform,
  getVersions: () => ({
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  }),
};

contextBridge.exposeInMainWorld('shellbase', shellbaseApi);
