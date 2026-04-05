import path from 'node:path';
import { test, expect, _electron as electron } from '@playwright/test';

test('launches app shell and sends a mock message', async () => {
  const electronApp = await electron.launch({
    args: [path.join(process.cwd(), 'dist-electron/main/index.js')],
  });

  try {
    const window = await electronApp.firstWindow();

    await window.waitForLoadState('domcontentloaded');
    await expect(window.getByRole('button', { name: 'Send message' })).toBeVisible();

    const message = 'Hello from Playwright';

    await window.getByLabel('Message composer').fill(message);
    await window.getByRole('button', { name: 'Send message' }).click();

    const messageThread = window.getByRole('list', { name: 'Message thread' });

    await expect(messageThread.getByText(message, { exact: true })).toBeVisible();
    await expect(
      messageThread.getByText(`Mock response: ${message}`, { exact: true }),
    ).toBeVisible();
  } finally {
    await electronApp.close();
  }
});
