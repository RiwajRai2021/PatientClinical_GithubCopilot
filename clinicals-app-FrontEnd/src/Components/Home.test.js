import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from './Home';

jest.mock('axios');

test('shows fallback patients when the backend returns 404', async () => {
  axios.get.mockRejectedValueOnce({
    response: { status: 404, data: { message: 'Not Found' } },
  });

  render(<Home />);

  await waitFor(() => {
    expect(screen.getByText(/Patient List/i)).toBeInTheDocument();
  });

  expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  expect(screen.getByText(/sample data/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /add patient/i })).toBeInTheDocument();
});

test('renders patient names and details from the backend payload', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      {
        id: 7,
        firstName: 'Alice',
        lastName: 'Johnson',
        age: 31,
      },
    ],
  });

  render(<Home />);

  await waitFor(() => {
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  expect(screen.getByText('31')).toBeInTheDocument();
  expect(screen.getByText(/Patient list loaded/i)).toBeInTheDocument();
});

test('renders patient names from snake_case backend fields', async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      patients: [
        {
          id: 8,
          first_name: 'Bob',
          last_name: 'Brown',
          email: 'bob@example.com',
          phone_number: '555-0003',
          age: 42,
        },
      ],
    },
  });

  render(<Home />);

  await waitFor(() => {
    expect(screen.getByText('Bob Brown')).toBeInTheDocument();
  });

  expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  expect(screen.getByText('555-0003')).toBeInTheDocument();
});
