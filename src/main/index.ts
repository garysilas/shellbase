import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';

const createMainWindow = (): BrowserWindow => {
  const isMac = process.platform === 'darwin';

  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#090b10',
    title: 'Shellbase',
    titleBarStyle: 'hidden',
    titleBarOverlay: isMac
      ? undefined
      : {
          color: '#262626',
          symbolColor: '#d4d4d8',
          height: 32,
        },
    trafficLightPosition: isMac ? { x: 16, y: 10 } : undefined,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(__dirname, '../../dist-renderer/index.html'));
  }

  return mainWindow;
};

void app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
