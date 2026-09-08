import React from 'react';
import { render, screen } from '@testing-library/react';
import PurchaseDone from '../pages/PurchaseDone';

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: {
      order: {
        _id: '64abc123',
        deliveryFee: 150,
        totalPrice: 1180,
        building: 'West Wing',
        room: 'B101',
        deliveryMethod: 'courier',
        createdAt: new Date().toISOString()
      },
      item: {
        item_name: 'Test Text Book',
        price: 1000,
        category: 'Literature'
      }
    }
  })
}));

// Mock browser APIs
window.scrollTo = jest.fn();
jest.mock('html2canvas', () => jest.fn());
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(), fillRect: jest.fn(), save: jest.fn(), restore: jest.fn(),
  translate: jest.fn(), rotate: jest.fn(), beginPath: jest.fn(), arc: jest.fn(), fill: jest.fn(),
}));

describe('PurchaseDone Component', () => {
  it('renders confirmation details correctly', () => {
    render(<PurchaseDone />);

    // Verification
    expect(screen.getByText(/Order Confirmed/i) || screen.getByText(/Successful/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Text Book/i)).toBeInTheDocument();
  });
});
