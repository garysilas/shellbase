import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the scaffold placeholder', () => {
    Object.defineProperty(window, 'shellbase', {
      configurable: true,
      value: {
        getPlatform: () => 'darwin',
        getVersions: () => ({
          electron: '1.0.0',
          chrome: '1.0.0',
          node: '1.0.0',
        }),
      },
    });

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Electron scaffold initialized.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('darwin')).toBeInTheDocument();
  });
});
