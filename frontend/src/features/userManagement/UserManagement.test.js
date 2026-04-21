import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

//  MOCK react-router-dom (IMPORTANT FIX)
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children }) => children,
}));

//  Mock API
jest.mock('../../api/userApi', () => ({
  loginUser: jest.fn(() =>
    Promise.resolve({
      data: {
        message: 'Login successful',
        token: 'mock-token',
        user: {},
      },
    })
  ),
  registerUser: jest.fn(() =>
    Promise.resolve({
      data: {
        message: 'Registration successful',
        email: 'test@my.sliit.lk',
      },
    })
  ),
}));

describe('User Management Module - Viva Evidence Tests', () => {
  
  describe('Login Flow Verification', () => {

    test('should render login labels correctly', () => {
      render(<LoginForm />);

      expect(screen.getByText('Secure Access')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Enter Vault/i })
      ).toBeInTheDocument();
    });

    test('should show validation hint for valid SLIIT email format', () => {
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox');
      fireEvent.change(emailInput, {
        target: { value: 'it21000000@my.sliit.lk' },
      });

      expect(
        screen.getByText('Valid SLIIT domain format')
      ).toBeInTheDocument();
    });
  });

  describe('Registration Flow Verification', () => {

    test('should render registration labels correctly', () => {
      render(<RegisterForm />);

      expect(screen.getByText('Join the Vault')).toBeInTheDocument();
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('University Email')).toBeInTheDocument();
      expect(screen.getByText('Student ID')).toBeInTheDocument();
      expect(screen.getByText('Faculty')).toBeInTheDocument();
    });

    test('should validate Student ID format', () => {
  render(<RegisterForm />);

  const inputs = screen.getAllByRole('textbox');
  const studentIdInput = inputs[2]; // Student ID field

  fireEvent.change(studentIdInput, {
    target: { value: 'IT21000000' },
  });

  expect(
    screen.getByText(/Must match your email prefix/i)
  ).toBeInTheDocument();
});
  });
});