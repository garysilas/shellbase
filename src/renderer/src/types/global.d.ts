import type { ShellbaseApi } from '@shared/shellbase-api';

declare global {
  interface Window {
    shellbase: ShellbaseApi;
  }
}

export {};
