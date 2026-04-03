export type ShellbaseVersions = Readonly<{
  electron: string;
  chrome: string;
  node: string;
}>;

export type ShellbaseApi = Readonly<{
  getPlatform: () => string;
  getVersions: () => ShellbaseVersions;
}>;
