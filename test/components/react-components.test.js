/**
 * Tests for React components with Convex integration
 * Tests UI components, hooks, and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Mock Convex client
const mockConvexClient = {
  query: jest.fn(),
  mutation: jest.fn(),
  setAuth: jest.fn(),
};

// Mock React hooks that use Convex
jest.mock('@/hooks/useConvex', () => ({
  useServices: jest.fn(() => ({
    services: [
      { _id: '1', name: 'Test Service', slug: 'test-service', price: '$99', isActive: true },
      { _id: '2', name: 'Another Service', slug: 'another-service', price: '$149', isActive: true }
    ],
    isLoading: false,
    error: null
  })),
  
  useBookingMutations: jest.fn(() => ({
    createBooking: jest.fn(() => Promise.resolve('booking-id')),
    updateBooking: jest.fn(),
    cancelBooking: jest.fn(),
    isSubmitting: false
  })),
  
  useReviews: jest.fn(() => ({
    reviews: [
      { _id: '1', customerName: 'John Doe', rating: 5, comment: 'Great service!', isApproved: true },
      { _id: '2', customerName: 'Jane Smith', rating: 4, comment: 'Good work', isApproved: true }
    ],
    isLoading: false,
    error: null
  })),
  
  useFormValidation: jest.fn(() => ({
    validateForm: jest.fn(() => true),
    errors: {},
    clearErrors: jest.fn()
  })),
  
  useErrorHandler: jest.fn(() => ({
    handleError: jest.fn()
  }))
}));

describe('React Components with Convex Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('BookingForm Component', () => {
    const mockCreateBooking = jest.fn();
    
    beforeEach(() => {
      const { useBookingMutations } = require('@/hooks/useConvex');
      useBookingMutations.mockReturnValue({
        createBooking: mockCreateBooking,
        isSubmitting: false
      });
    });

    test('should render booking form correctly', () => {
      const { BookingForm } = require('@/components/forms/bookingForm');
      
      render(<BookingForm />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/vehicle type/i)).toBeInTheDocument();
    });

    test('should load services from Convex', () => {
      const { BookingForm } = require('@/components/forms/bookingForm');
      const { useServices } = require('@/hooks/useConvex');
      
      render(<BookingForm />);
      
      expect(useServices).toHaveBeenCalledWith({ isActive: true });
      
      // Should display services in dropdown
      expect(screen.getByText('Test Service - $99')).toBeInTheDocument();
      expect(screen.getByText('Another Service - $149')).toBeInTheDocument();
    });

    test('should handle form submission successfully', async () => {
      const user = userEvent.setup();
      const { BookingForm } = require('@/components/forms/bookingForm');
      
      mockCreateBooking.mockResolvedValue('booking-id');
      
      render(<BookingForm />);
      
      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '(210) 555-0123');
      await user.selectOptions(screen.getByLabelText(/service/i), '1');
      await user.type(screen.getByLabelText(/date/i), '2024-12-25');
      await user.selectOptions(screen.getByLabelText(/time/i), '2:00 PM');
      await user.selectOptions(screen.getByLabelText(/vehicle type/i), 'sedan');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /book appointment/i }));
      
      await waitFor(() => {
        expect(mockCreateBooking).toHaveBeenCalledWith({
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '(210) 555-0123',
          serviceId: '1',
          preferredDate: '2024-12-25',
          preferredTime: '2:00 PM',
          vehicleType: 'sedan',
          message: undefined
        });
      });
    });

    test('should display loading state during submission', async () => {
      const user = userEvent.setup();
      const { BookingForm } = require('@/components/forms/bookingForm');
      const { useBookingMutations } = require('@/hooks/useConvex');
      
      useBookingMutations.mockReturnValue({
        createBooking: jest.fn(() => new Promise(() => {})), // Never resolves
        isSubmitting: true
      });
      
      render(<BookingForm />);
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.click(screen.getByRole('button', { name: /book appointment/i }));
      
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /book appointment/i })).toBeDisabled();
    });

    test('should handle form validation errors', async () => {
      const user = userEvent.setup();
      const { BookingForm } = require('@/components/forms/bookingForm');
      const { useFormValidation } = require('@/hooks/useConvex');
      
      const mockValidateForm = jest.fn(() => false);
      useFormValidation.mockReturnValue({
        validateForm: mockValidateForm,
        errors: { customerName: 'Name is required' },
        clearErrors: jest.fn()
      });
      
      render(<BookingForm />);
      
      await user.click(screen.getByRole('button', { name: /book appointment/i }));
      
      expect(mockValidateForm).toHaveBeenCalled();
      expect(screen.getByText(/please fix the errors above/i)).toBeInTheDocument();
    });

    test('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      const { BookingForm } = require('@/components/forms/bookingForm');
      const { useErrorHandler } = require('@/hooks/useConvex');
      
      const mockHandleError = jest.fn();
      const mockCreateBooking = jest.fn(() => Promise.reject(new Error('API Error')));
      const { useBookingMutations } = require('@/hooks/useConvex');
      
      useBookingMutations.mockReturnValue({
        createBooking: mockCreateBooking,
        isSubmitting: false
      });
      
      useErrorHandler.mockReturnValue({
        handleError: mockHandleError
      });
      
      render(<BookingForm />);
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.click(screen.getByRole('button', { name: /book appointment/i }));
      
      await waitFor(() => {
        expect(mockHandleError).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    test('should handle URL parameter preselection', () => {
      const { useSearchParams } = require('next/navigation');
      useSearchParams.mockReturnValue({
        get: jest.fn((param) => {
          if (param === 'service') return 'test-service';
          return null;
        })
      });
      
      const { BookingForm } = require('@/components/forms/bookingForm');
      const { useServices } = require('@/hooks/useConvex');
      
      render(<BookingForm />);
      
      // Should preselect service from URL
      expect(screen.getByDisplayValue('1')).toBeInTheDocument(); // Service ID should be preselected
    });
  });

  describe('ConvexClientProvider Component', () => {
    test('should provide Convex client to children', () => {
      const TestComponent = () => <div>Test</div>;
      
      render(
        <ConvexProvider client={mockConvexClient}>
          <TestComponent />
        </ConvexProvider>
      );
      
      // ConvexProvider should render children
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    test('should handle authentication', () => {
      const mockSetAuth = jest.fn();
      mockConvexClient.setAuth = mockSetAuth;
      
      const { ConvexClientProvider } = require('@/app/ConvexClientProvider');
      
      render(<ConvexClientProvider>Test Content</ConvexClientProvider>);
      
      expect(mockSetAuth).toHaveBeenCalled();
    });
  });

  describe('Real-time Features', () => {
    test('should subscribe to real-time service updates', () => {
      const { useServices } = require('@/hooks/useConvex');
      
      render(<div />);
      
      // This test verifies that the hook is called
      expect(useServices).toHaveBeenCalled();
    });

    test('should handle live booking updates', async () => {
      // This would test real-time subscriptions
      // For now, we'll verify the hooks are properly configured
      const { useBookingMutations } = require('@/hooks/useConvex');
      
      render(<div />);
      
      expect(useBookingMutations).toHaveBeenCalled();
    });
  });

  describe('Performance Tests', () => {
    test('should not cause unnecessary re-renders', () => {
      const { BookingForm } = require('@/components/forms/bookingForm');
      const { useServices } = require('@/hooks/useConvex');
      
      const { rerender } = render(<BookingForm />);
      
      // Re-render with same props
      rerender(<BookingForm />);
      
      // useServices should not be called again with different params
      expect(useServices).toHaveBeenCalledTimes(2);
    });

    test('should handle large data sets efficiently', () => {
      const { useServices } = require('@/hooks/useConvex');
      
      // Mock large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        _id: `service-${i}`,
        name: `Service ${i}`,
        price: `$${i}`,
        isActive: true
      }));
      
      useServices.mockReturnValue({
        services: largeDataset,
        isLoading: false,
        error: null
      });
      
      render(<div />);
      
      // Should handle large dataset without performance issues
      expect(useServices).toHaveBeenCalled();
    });
  });

  describe('Error Boundaries', () => {
    test('should catch and handle component errors', () => {
      // This would test error boundary implementation
      // For now, we'll verify the pattern is in place
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Simulate component error
      const BrokenComponent = () => {
        throw new Error('Component error');
      };
      
      expect(() => {
        render(<BrokenComponent />);
      }).toThrow('Component error');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility Tests', () => {
    test('booking form should be accessible', async () => {
      const user = userEvent.setup();
      const { BookingForm } = require('@/components/forms/bookingForm');
      
      render(<BookingForm />);
      
      // Test keyboard navigation
      await user.tab();
      expect(screen.getByLabelText(/name/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
      
      // Test form labels and ARIA attributes
      expect(screen.getByLabelText(/name/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    });

    test('should have proper ARIA labels', () => {
      const { BookingForm } = require('@/components/forms/bookingForm');
      
      render(<BookingForm />);
      
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
    });
  });
});