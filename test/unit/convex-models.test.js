/**
 * Unit tests for Convex models
 * Tests the business logic layer of the Convex backend
 */

describe('Convex Models - Unit Tests', () => {
  
  describe('Service Model', () => {
    let mockCtx, mockDb;

    beforeEach(() => {
      mockDb = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        query: jest.fn(() => ({
          filter: jest.fn(() => ({
            collect: jest.fn(() => Promise.resolve([]))
          }))
        }))
      };
      
      mockCtx = {
        db: mockDb,
        auth: {
          user: { id: 'admin-id', isAdmin: true }
        }
      };
    });

    describe('createService', () => {
      test('should create a service with valid data', async () => {
        const { createService } = require('../convex/model/services');
        
        const serviceData = {
          name: 'Premium Detailing',
          slug: 'premium-detailing',
          category: 'primary',
          title: 'Premium Auto Detailing Service',
          description: 'Our premium detailing package',
          metaDescription: 'Premium auto detailing in San Antonio',
          price: '$199',
          isActive: true,
          sortOrder: 1
        };

        mockDb.insert.mockReturnValue(Promise.resolve('service-id'));

        const result = await createService(mockCtx, serviceData);

        expect(mockDb.insert).toHaveBeenCalledWith('services', expect.objectContaining({
          ...serviceData,
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number)
        }));
        
        expect(result).toBe('service-id');
      });

      test('should throw error for invalid service data', async () => {
        const { createService } = require('../convex/model/services');
        
        const invalidData = {
          name: '', // Empty name should fail validation
          slug: 'valid-slug',
          category: 'invalid-category'
        };

        await expect(createService(mockCtx, invalidData))
          .rejects.toThrow('Invalid service data');
      });

      test('should throw error for duplicate slug', async () => {
        const { createService } = require('../convex/model/services');
        
        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve([{ _id: 'existing-id' }])
          })
        });

        const serviceData = {
          name: 'Test Service',
          slug: 'existing-slug',
          category: 'primary'
        };

        await expect(createService(mockCtx, serviceData))
          .rejects.toThrow('Service with this slug already exists');
      });
    });

    describe('updateService', () => {
      test('should update existing service', async () => {
        const { updateService } = require('../convex/model/services');
        
        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'service-id',
          name: 'Old Name',
          slug: 'test-service'
        }));

        const updates = {
          name: 'Updated Service Name',
          description: 'Updated description'
        };

        await updateService(mockCtx, 'service-id', updates);

        expect(mockDb.update).toHaveBeenCalledWith('services', 'service-id', expect.objectContaining({
          ...updates,
          updatedAt: expect.any(Number)
        }));
      });

      test('should throw error for non-existent service', async () => {
        const { updateService } = require('../convex/model/services');
        
        mockDb.get.mockReturnValue(Promise.resolve(null));

        await expect(updateService(mockCtx, 'non-existent-id', { name: 'New Name' }))
          .rejects.toThrow('Service not found');
      });
    });

    describe('deleteService', () => {
      test('should delete existing service', async () => {
        const { deleteService } = require('../convex/model/services');
        
        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'service-id',
          name: 'Test Service'
        }));

        await deleteService(mockCtx, 'service-id');

        expect(mockDb.delete).toHaveBeenCalledWith('services', 'service-id');
      });

      test('should throw error for non-existent service', async () => {
        const { deleteService } = require('../convex/model/services');
        
        mockDb.get.mockReturnValue(Promise.resolve(null));

        await expect(deleteService(mockCtx, 'non-existent-id'))
          .rejects.toThrow('Service not found');
      });

      test('should check for dependent bookings before deletion', async () => {
        const { deleteService } = require('../convex/model/services');
        
        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'service-id',
          name: 'Test Service'
        }));

        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve([{ _id: 'booking-id' }])
          })
        });

        await expect(deleteService(mockCtx, 'service-id'))
          .rejects.toThrow('Cannot delete service with existing bookings');
      });
    });
  });

  describe('Booking Model', () => {
    let mockCtx, mockDb;

    beforeEach(() => {
      mockDb = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        query: jest.fn(() => ({
          filter: jest.fn(() => ({
            collect: jest.fn(() => Promise.resolve([]))
          }))
        }))
      };
      
      mockCtx = {
        db: mockDb,
        auth: {
          user: { id: 'admin-id', isAdmin: true }
        }
      };
    });

    describe('createBooking', () => {
      test('should create a booking with valid data', async () => {
        const { createBooking } = require('../convex/model/bookings');
        
        const bookingData = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '(210) 555-0123',
          serviceId: 'service-id',
          preferredDate: '2024-12-25',
          preferredTime: '2:00 PM',
          vehicleType: 'sedan',
          message: 'Test booking'
        };

        mockDb.insert.mockReturnValue(Promise.resolve('booking-id'));
        mockDb.get.mockReturnValue(Promise.resolve({ _id: 'service-id', name: 'Test Service' }));

        const result = await createBooking(mockCtx, bookingData);

        expect(mockDb.insert).toHaveBeenCalledWith('bookings', expect.objectContaining({
          ...bookingData,
          status: 'pending',
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number)
        }));
        
        expect(result).toBe('booking-id');
      });

      test('should validate required fields', async () => {
        const { createBooking } = require('../convex/model/bookings');
        
        const invalidData = {
          customerName: '', // Missing required field
          customerEmail: 'invalid-email', // Invalid email
          serviceId: 'service-id'
        };

        await expect(createBooking(mockCtx, invalidData))
          .rejects.toThrow('Invalid booking data');
      });

      test('should check for scheduling conflicts', async () => {
        const { createBooking } = require('../convex/model/bookings');
        
        mockDb.insert.mockReturnValue(Promise.resolve('booking-id'));
        mockDb.get.mockReturnValue(Promise.resolve({ _id: 'service-id', name: 'Test Service' }));
        
        // Mock existing booking at same time
        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve([{ _id: 'existing-booking' }])
          })
        });

        const bookingData = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '(210) 555-0123',
          serviceId: 'service-id',
          preferredDate: '2024-12-25',
          preferredTime: '2:00 PM', // Same time as existing booking
          vehicleType: 'sedan'
        };

        await expect(createBooking(mockCtx, bookingData))
          .rejects.toThrow('Scheduling conflict detected');
      });
    });

    describe('updateBookingStatus', () => {
      test('should update booking status', async () => {
        const { updateBookingStatus } = require('../convex/model/bookings');
        
        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'booking-id',
          status: 'pending',
          createdAt: Date.now()
        }));

        await updateBookingStatus(mockCtx, 'booking-id', 'confirmed');

        expect(mockDb.update).toHaveBeenCalledWith('bookings', 'booking-id', expect.objectContaining({
          status: 'confirmed',
          confirmedAt: expect.any(Number),
          updatedAt: expect.any(Number)
        }));
      });

      test('should validate status transitions', async () => {
        const { updateBookingStatus } = require('../convex/model/bookings');
        
        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'booking-id',
          status: 'cancelled',
          createdAt: Date.now()
        }));

        await expect(updateBookingStatus(mockCtx, 'booking-id', 'pending'))
          .rejects.toThrow('Invalid status transition');
      });
    });
  });

  describe('Review Model', () => {
    let mockCtx, mockDb;

    beforeEach(() => {
      mockDb = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
        query: jest.fn(() => ({
          filter: jest.fn(() => ({
            collect: jest.fn(() => Promise.resolve([]))
          }))
        }))
      };
      
      mockCtx = {
        db: mockDb
      };
    });

    describe('createReview', () => {
      test('should create a review with valid data', async () => {
        const { createReview } = require('../convex/model/reviews');
        
        const reviewData = {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          rating: 5,
          comment: 'Excellent service!',
          serviceId: 'service-id'
        };

        mockDb.insert.mockReturnValue(Promise.resolve('review-id'));

        const result = await createReview(mockCtx, reviewData);

        expect(mockDb.insert).toHaveBeenCalledWith('reviews', expect.objectContaining({
          ...reviewData,
          isApproved: false,
          isFeatured: false,
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number)
        }));
        
        expect(result).toBe('review-id');
      });

      test('should validate rating range', async () => {
        const { createReview } = require('../convex/model/reviews');
        
        const invalidData = {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          rating: 10, // Invalid rating (should be 1-5)
          comment: 'Good service',
          serviceId: 'service-id'
        };

        await expect(createReview(mockCtx, invalidData))
          .rejects.toThrow('Rating must be between 1 and 5');
      });

      test('should validate comment length', async () => {
        const { createReview } = require('../convex/model/reviews');
        
        const invalidData = {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          rating: 5,
          comment: 'x'.repeat(1001), // Comment too long
          serviceId: 'service-id'
        };

        await expect(createReview(mockCtx, invalidData))
          .rejects.toThrow('Comment too long');
      });
    });
  });
});