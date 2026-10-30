import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import Tools from '../src/pages/Tools';

test('tools marketplace renders and filters', () => {
  render(
    <HashRouter>
      <Tools />
    </HashRouter>
  );

  expect(screen.getByText(/Small tools that do/i)).toBeTruthy();
  expect(screen.getByText('API Comparator')).toBeTruthy();

  fireEvent.change(screen.getByLabelText('Search tools'), { target: { value: 'radio' } });
  expect(screen.getByText('Radio Osho')).toBeTruthy();
  expect(screen.queryByText('API Comparator')).not.toBeTruthy();

  fireEvent.change(screen.getByLabelText('Search tools'), { target: { value: 'zzzz' } });
  expect(screen.getByText('No tools found')).toBeTruthy();
});
