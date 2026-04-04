import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the shell foundation layout', () => {
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

    expect(screen.getByRole('heading', { name: 'New chat' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open conversation panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Conversation panel')).not.toBeInTheDocument();
    expect(screen.getByText('darwin session')).toBeInTheDocument();
  });
});
