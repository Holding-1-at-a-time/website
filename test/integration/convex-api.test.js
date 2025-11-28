/**
 * Integration tests for Convex API functions
 * Tests the API layer with validation and authorization
 */

describe('Convex API - Integration Tests', () => {
  
  describe('Services API', () => {
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

    describe('getActiveServices', () => {
      test('should return only active services', async () => {
        const { getActiveServices } = require('../convex/api/services');
        
        const mockServices = [
          { _id: '1', name: 'Active Service', isActive: true },
          { _id: '2', name: 'Inactive Service', isActive: false },
          { _id: '3', name: 'Another Active Service', isActive: true }
        ];

        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve(mockServices)
          })
        });

        const result = await getActiveServices({});

        expect(mockDb.query).toHaveBeenCalledWith('services');
        expect(result).toHaveLength(2);
        expect(result.every(s => s.isActive)).toBe(true);
      });

      test('should handle database errors gracefully', async () => {
        const { getActiveServices } = require('../convex/api/services');
        
        mockDb.query.mockImplementation(() => {
          throw new Error('Database connection error');
        });

        await expect(getActiveServices({}))
          .rejects.toThrow('Database connection error');
      });
    });

    describe('createService - Admin Only', () => {
      test('should allow admin users to create services', async () => {
        const { createService } = require('../convex/api/services');
        
        const serviceData = {
          name: 'New Service',
          slug: 'new-service',
          category: 'primary',
          title: 'New Service Title',
          description: 'Service description',
          metaDescription: 'Meta description',
          price: '$99',
          isActive: true,
          sortOrder: 1
        };

        mockDb.insert.mockReturnValue(Promise.resolve('new-service-id'));

        const result = await createService(mockCtx, serviceData);

        expect(result).toBe('new-service-id');
      });

      test('should reject non-admin users', async () => {
        const { createService } = require('../convex/api/services');
        
        const nonAdminCtx = {
          ...mockCtx,
          auth: { user: { id: 'user-id', isAdmin: false } }
        };

        const serviceData = { name: 'Test Service', slug: 'test-service', category: 'primary' };

        await expect(createService(nonAdminCtx, serviceData))
          .rejects.toThrow('Admin access required');
      });

      test('should validate input data', async () => {
        const { createService } = require('../convex/api/services');
        
        const invalidData = {
          name: '', // Empty name
          slug: 'test-service',
          category: 'primary'
        };

        await expect(createService(mockCtx, invalidData))
          .rejects.toThrow('Service name is required');
      });
    });

    describe('updateService - Admin Only', () => {
      test('should allow admin users to update services', async () => {
        const { updateService } = require('../convex/api/services');
        
        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'service-id',
          name: 'Old Name'
        }));

        const updates = { name: 'Updated Name' };
        await updateService(mockCtx, 'service-id', updates);

        expect(mockDb.update).toHaveBeenCalledWith('services', 'service-id', expect.objectContaining({
          name: 'Updated Name',
          updatedAt: expect.any(Number)
        }));
      });

      test('should reject updates to non-existent services', async () => {
        const { updateService } = require('../convex/api/services');
        
        mockDb.get.mockReturnValue(Promise.resolve(null));

        await expect(updateService(mockCtx, 'non-existent-id', { name: 'New Name' }))
          .rejects.toThrow('Service not found');
      });
    });
  });

  describe('Bookings API', () => {
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

    describe('createBooking - Public Access', () => {
      test('should allow guest users to create bookings', async () => {
        const { createBooking } = require('../convex/api/bookings');
        
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

        expect(result).toBe('booking-id');
      });

      test('should validate email format', async () => {
        const { createBooking } = require('../convex/api/bookings');
        
        const invalidData = {
          customerName: 'John Doe',
          customerEmail: 'invalid-email',
          serviceId: 'service-id'
        };

        await expect(createBooking(mockCtx, invalidData))
          .rejects.toThrow('Valid email is required');
      });

      test('should validate phone format', async () => {
        const { createBooking } = require('../convex/api/bookings');
        
        const invalidData = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '123', // Invalid phone
          serviceId: 'service-id'
        };

        await expect(createBooking(mockCtx, invalidData))
          .rejects.toThrow('Valid phone number is required');
      });

      test('should validate date format', async () => {
        const { createBooking } = require('../convex/api/bookings');
        
        const invalidData = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          serviceId: 'service-id',
          preferredDate: '2024/12/25', // Wrong format
          preferredTime: '2:00 PM'
        };

        await expect(createBooking(mockCtx, invalidData))
          .rejects.toThrow('Date must be in YYYY-MM-DD format');
      });

      test('should enforce rate limiting', async () => {
        const { createBooking } = require('../convex/api/bookings');
        
        // Simulate multiple rapid requests from same email
        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve([
              { _id: '1', createdAt: Date.now() - 30000 }, // 30 seconds ago
              { _id: '2', createdAt: Date.now() - 10000 }  // 10 seconds ago
            ])
          })
        });

        const bookingData = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '(210) 555-0123',
          serviceId: 'service-id',
          preferredDate: '2024-12-25',
          preferredTime: '3:00 PM'
        };

        await expect(createBooking(mockCtx, bookingData))
          .rejects.toThrow('Too many booking requests');
      });
    });

    describe('getBookings - Admin Only', () => {
      test('should allow admin users to view all bookings', async () => {
        const { getBookings } = require('../convex/api/bookings');
        
        const adminCtx = {
          ...mockCtx,
          auth: { user: { id: 'admin-id', isAdmin: true } }
        };

        const mockBookings = [
          { _id: '1', customerName: 'John Doe', status: 'pending' },
          { _id: '2', customerName: 'Jane Smith', status: 'confirmed' }
        ];

        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve(mockBookings)
          })
        });

        const result = await getBookings(adminCtx, { limit: 10 });

        expect(result).toHaveLength(2);
        expect(result[0].customerName).toBe('John Doe');
      });

      test('should reject non-admin users', async () => {
        const { getBookings } = require('../convex/api/bookings');
        
        await expect(getBookings(mockCtx, { limit: 10 }))
          .rejects.toThrow('Admin access required');
      });
    });
  });

  describe('Reviews API', () => {
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

    describe('createReview - Public Access', () => {
      test('should allow customers to submit reviews', async () => {
        const { createReview } = require('../convex/api/reviews');
        
        const reviewData = {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          rating: 5,
          comment: 'Excellent service!',
          serviceId: 'service-id'
        };

        mockDb.insert.mockReturnValue(Promise.resolve('review-id'));

        const result = await createReview(mockCtx, reviewData);

        expect(result).toBe('review-id');
        expect(mockDb.insert).toHaveBeenCalledWith('reviews', expect.objectContaining({
          ...reviewData,
          isApproved: false,
          isFeatured: false
        }));
      });

      test('should require minimum comment length', async () => {
        const { createReview } = require('../convex/api/reviews');
        
        const shortReview = {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          rating: 5,
          comment: 'Good', // Too short
          serviceId: 'service-id'
        };

        await expect(createReview(mockCtx, shortReview))
          .rejects.toThrow('Comment must be at least 10 characters long');
      });

      test('should prevent spam submissions', async () => {
        const { createReview } = require('../convex/api/reviews');
        
        // Simulate recent submission from same email
        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve([
              { _id: 'recent', createdAt: Date.now() - 5000 } // 5 seconds ago
            ])
          })
        });

        const reviewData = {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          rating: 5,
          comment: 'Great service overall!',
          serviceId: 'service-id'
        };

        await expect(createReview(mockCtx, reviewData))
          .rejects.toThrow('Review submission too frequent');
      });
    });

    describe('getApprovedReviews - Public Access', () => {
      test('should return only approved reviews', async () => {
        const { getApprovedReviews } = require('../convex/api/reviews');
        
        const mockReviews = [
          { _id: '1', customerName: 'John', rating: 5, isApproved: true, isFeatured: true },
          { _id: '2', customerName: 'Jane', rating: 4, isApproved: true, isFeatured: false },
          { _id: '3', customerName: 'Bob', rating: 3, isApproved: false, isFeatured: false }
        ];

        mockDb.query.mockReturnValue({
          filter: () => ({
            collect: () => Promise.resolve(mockReviews)
          })
        });

        const result = await getApprovedReviews({ serviceId: 'service-id' });

        expect(result).toHaveLength(2);
        expect(result.every(r => r.isApproved)).toBe(true);
      });
    });

    describe('moderateReview - Admin Only', () => {
      test('should allow admin to approve reviews', async () => {
        const { moderateReview } = require('../convex/api/reviews');
        
        const adminCtx = {
          ...mockCtx,
          auth: { user: { id: 'admin-id', isAdmin: true } }
        };

        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'review-id',
          customerName: 'Jane Doe',
          isApproved: false
        }));

        await moderateReview(adminCtx, 'review-id', { action: 'approve' });

        expect(mockDb.update).toHaveBeenCalledWith('reviews', 'review-id', expect.objectContaining({
          isApproved: true,
          updatedAt: expect.any(Number)
        }));
      });

      test('should allow admin to feature reviews', async () => {
        const { moderateReview } = require('../convex/api/reviews');
        
        const adminCtx = {
          ...mockCtx,
          auth: { user: { id: 'admin-id', isAdmin: true } }
        };

        mockDb.get.mockReturnValue(Promise.resolve({
          _id: 'review-id',
          customerName: 'Jane Doe',
          isApproved: true,
          isFeatured: false
        }));

        await moderateReview(adminCtx, 'review-id', { action: 'feature' });

        expect(mockDb.update).toHaveBeenCalledWith('reviews', 'review-id', expect.objectContaining({
          isFeatured: true,
          updatedAt: expect.any(Number)
        }));
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle Convex function errors gracefully', async () => {
      const { getActiveServices } = require('../convex/api/services');
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockDb.query.mockImplementation(() => {
        throw new Error('Convex database error');
      });

      await expect(getActiveServices({}))
        .rejects.toThrow('Convex database error');

      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should provide meaningful error messages', async () => {
      const { createBooking } = require('../convex/api/bookings');
      
      const invalidData = {
        customerName: 'John Doe',
        customerEmail: '', // Empty email
        serviceId: 'service-id'
      };

      await expect(createBooking({ db: mockDb }, invalidData))
        .rejects.toThrow('Valid email is required');
    });
  });
});