import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders the patient list heading', async () => {
  axios.get.mockRejectedValueOnce({ response: { status: 404 } });

  render(<App />);

  expect(await screen.findByText(/Patient List/i)).toBeInTheDocument();
});
