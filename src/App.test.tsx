import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the cocktail bar heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', {
    level: 2,
    name: /Cocktail Bar/i,
  });
  expect(heading).toBeInTheDocument();
});

test('renders the menu CTA button on the landing page', () => {
  render(<App />);
  const cta = screen.getByRole('button', { name: /Consulta il Menu/i });
  expect(cta).toBeEnabled();
});
