import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';

test('renders portfolio app', () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  const nameElement = screen.getByText(/Hi, I'm Sujay/i);
  expect(nameElement).toBeInTheDocument();
});