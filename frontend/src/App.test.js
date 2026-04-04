import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const homepageElement = screen.getByText(/UniVault/i); // Adjust based on an actual element in Homepage.jsx
  expect(homepageElement).toBeInTheDocument();
});
