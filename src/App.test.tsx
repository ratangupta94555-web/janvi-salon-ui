import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

afterEach(() => {
  window.history.replaceState({}, '', '/');
  window.sessionStorage.clear();
});

test('shows a themed not-found page for an unknown URL', () => {
  window.history.replaceState({}, '', '/this-page-does-not-exist');

  render(<App />);

  expect(
    screen.getByRole('heading', { name: /this page isn’t in our studio/i }),
  ).toBeInTheDocument();
  expect(screen.getByText('404')).toBeInTheDocument();
});

test('the not-found page can navigate back home', async () => {
  window.history.replaceState({}, '', '/unknown-page');

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /back to home/i }));

  expect(window.location.pathname).toBe('/');
  await waitFor(() => {
    expect(
      screen.queryByRole('heading', {
        name: /this page isn’t in our studio/i,
      }),
    ).not.toBeInTheDocument();
  });
});
