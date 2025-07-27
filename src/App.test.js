import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders portfolio app', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const nameElement = screen.getByText(/Hi, I'm Sujay/i);
  expect(nameElement).toBeInTheDocument();
});