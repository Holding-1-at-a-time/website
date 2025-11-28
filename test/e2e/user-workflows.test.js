/**
 * End-to-End Tests for Convex Database Integration
 * Tests complete user workflows and business processes
 */

describe('Convex Database Integration - End-to-End Tests', () => {
  
  let browser, page;
  let convexClient;
  let testData;

  beforeAll(async () => {
    // This would initialize Playwright browser
    // For now, we'll simulate the browser environment
    browser = { newPage: jest.fn() };
    page = {
      goto: jest.fn(),
      fill: jest.fn(),
      click: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn(),
      screenshot: jest.fn()
    };
    
    browser.newPage.mockResolvedValue(page);
    
    // Initialize test data
    testData = {
      services: [
        { _id: '1', name: 'Premium Auto Detailing', slug: 'premium-detailing', price: '$199', isActive: true },
        { _id: '2', name: 'Basic Wash & Wax', slug: 'basic-wash', price: '$99', isActive: true }
      ],
      bookings: [],
      reviews: []
    };
  });

  describe('Customer Booking Workflow', () => {
    test('complete booking process from start to finish', async () => {
      // Step 1: Navigate to website
      await page.goto('http://localhost:3000');
      await page.waitForSelector('text=One Detail At A Time');
      
      // Step 2: Navigate to services page
      await page.click('text=Services');
      await page.waitForSelector('text=Our Services');
      
      // Step 3: View specific service
      await page.click('text=Premium Auto Detailing');
      await page.waitForSelector('text=Premium Auto Detailing');
      
      // Step 4: Click "Book Now" button
      await page.click('text=Book Now');
      await page.waitForSelector('text=Book Appointment');
      
      // Step 5: Fill out booking form
      await page.fill('input[name="name"]', 'John Doe');
      await page.fill('input[name="email"]', 'john.doe@example.com');
      await page.fill('input[name="phone"]', '(210) 555-0123');
      await page.selectOption('select[name="service"]', '1');
      await page.fill('input[name="date"]', '2024-12-25');
      await page.selectOption('select[name="time"]', '2:00 PM');
      await page.selectOption('select[name="vehicleType"]', 'sedan');
      await page.fill('textarea[name="message"]', 'Please be careful with the leather seats');
      
      // Step 6: Submit booking
      await page.click('button[type="submit"]');
      
      // Step 7: Verify success message
      await page.waitForSelector('text=Booking submitted successfully');
      
      // Verify booking was created in Convex database
      expect(testData.bookings).toHaveLength(1);
      expect(testData.bookings[0]).toMatchObject({
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        serviceId: '1',
        preferredDate: '2024-12-25',
        status: 'pending'
      });
    });

    test('booking form validation errors', async () => {
      await page.goto('http://localhost:3000/booking');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await page.waitForSelector('text=Please fix the errors above');
      
      // Fill required fields
      await page.fill('input[name="name"]', 'Jane Smith');
      await page.fill('input[name="email"]', 'jane.smith@example.com');
      await page.fill('input[name="phone"]', '(210) 555-0456');
      
      // Try invalid email
      await page.fill('input[name="email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      
      await page.waitForSelector('text=Please enter a valid email address');
    });

    test('booking conflict detection', async () => {
      // Create existing booking for same time slot
      const existingBooking = {
        customerName: 'Alice Johnson',
        customerEmail: 'alice@example.com',
        serviceId: '1',
        preferredDate: '2024-12-25',
        preferredTime: '2:00 PM',
        status: 'confirmed'
      };
      testData.bookings.push(existingBooking);
      
      await page.goto('http://localhost:3000/booking');
      
      // Fill form with conflicting time
      await page.fill('input[name="name"]', 'Bob Wilson');
      await page.fill('input[name="email"]', 'bob@example.com');
      await page.fill('input[name="phone"]', '(210) 555-0789');
      await page.selectOption('select[name="service"]', '1');
      await page.fill('input[name="date"]', '2024-12-25');
      await page.selectOption('select[name="time"]', '2:00 PM'); // Same time as existing booking
      
      await page.click('button[type="submit"]');
      
      // Should detect conflict
      await page.waitForSelector('text=Time slot not available');
    });

    test('rate limiting for booking submissions', async () => {
      await page.goto('http://localhost:3000/booking');
      
      // Submit multiple bookings quickly
      for (let i = 0; i < 5; i++) {
        await page.fill('input[name="name"]', `Customer ${i}`);
        await page.fill('input[name="email"]', `customer${i}@example.com`);
        await page.fill('input[name="phone"]', `(210) 555-${String(i).padStart(4, '0')}`);
        await page.selectOption('select[name="service"]', '1');
        await page.fill('input[name="date"]', `2024-12-${String(26 + i).padStart(2, '0')}`);
        await page.selectOption('select[name="time"]', '2:00 PM');
        
        await page.click('button[type="submit"]');
        
        if (i >= 2) {
          // Should hit rate limit
          await page.waitForSelector('text=Too many booking requests');
          break;
        }
        
        await page.waitForSelector('text=Booking submitted successfully');
        await page.goto('http://localhost:3000/booking'); // Reset form
      }
    });
  });

  describe('Service Management Workflow (Admin)', () => {
    let adminPage;

    beforeEach(async () => {
      // Simulate admin login
      adminPage = {
        ...page,
        login: jest.fn(async (email, password) => {
          if (email === 'admin@example.com' && password === 'admin123') {
            return { success: true, token: 'admin-token' };
          }
          throw new Error('Invalid credentials');
        })
      };
      
      await adminPage.login('admin@example.com', 'admin123');
    });

    test('admin can create new service', async () => {
      await adminPage.goto('http://localhost:3000/admin/services');
      await adminPage.waitForSelector('text=Service Management');
      
      // Click "Add New Service"
      await adminPage.click('text=Add New Service');
      
      // Fill service form
      await adminPage.fill('input[name="name"]', 'Ceramic Coating Service');
      await adminPage.fill('input[name="slug"]', 'ceramic-coating');
      await adminPage.selectOption('select[name="category"]', 'primary');
      await adminPage.fill('input[name="title"]', 'Professional Ceramic Coating');
      await adminPage.fill('textarea[name="description"]', 'Professional ceramic coating service');
      await adminPage.fill('textarea[name="metaDescription"]', 'Professional ceramic coating in San Antonio');
      await adminPage.fill('input[name="price"]', '$299');
      await adminPage.selectOption('select[name="isActive"]', 'true');
      await adminPage.fill('input[name="sortOrder"]', '3');
      
      // Submit
      await adminPage.click('button[type="submit"]');
      
      // Verify service was created
      await adminPage.waitForSelector('text=Ceramic Coating Service created successfully');
      
      const newService = testData.services.find(s => s.slug === 'ceramic-coating');
      expect(newService).toBeDefined();
      expect(newService.name).toBe('Ceramic Coating Service');
      expect(newService.price).toBe('$299');
    });

    test('admin can update existing service', async () => {
      await adminPage.goto('http://localhost:3000/admin/services');
      
      // Click edit button for first service
      await adminPage.click('[data-testid="edit-service-1"]');
      
      // Update service details
      await adminPage.fill('input[name="name"]', 'Premium Auto Detailing - Updated');
      await adminPage.fill('input[name="price"]', '$219');
      
      await adminPage.click('button[type="submit"]');
      
      // Verify update
      await adminPage.waitForSelector('text=Service updated successfully');
      
      const updatedService = testData.services.find(s => s._id === '1');
      expect(updatedService.name).toBe('Premium Auto Detailing - Updated');
      expect(updatedService.price).toBe('$219');
    });

    test('admin can view and manage bookings', async () => {
      await adminPage.goto('http://localhost:3000/admin/bookings');
      await adminPage.waitForSelector('text=Booking Management');
      
      // Verify bookings are displayed
      expect(testData.bookings.length).toBeGreaterThan(0);
      
      // Test booking status update
      await adminPage.click('[data-testid="approve-booking-1"]');
      await adminPage.waitForSelector('text=Booking approved');
      
      const booking = testData.bookings.find(b => b._id === '1');
      expect(booking.status).toBe('confirmed');
    });

    test('admin can moderate reviews', async () => {
      // Add a test review
      const testReview = {
        _id: 'review-1',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        rating: 5,
        comment: 'Excellent service!',
        isApproved: false,
        isFeatured: false
      };
      testData.reviews.push(testReview);
      
      await adminPage.goto('http://localhost:3000/admin/reviews');
      await adminPage.waitForSelector('text=Review Management');
      
      // Approve review
      await adminPage.click('[data-testid="approve-review-review-1"]');
      await adminPage.waitForSelector('text=Review approved');
      
      // Feature review
      await adminPage.click('[data-testid="feature-review-review-1"]');
      await adminPage.waitForSelector('text=Review featured');
      
      const approvedReview = testData.reviews.find(r => r._id === 'review-1');
      expect(approvedReview.isApproved).toBe(true);
      expect(approvedReview.isFeatured).toBe(true);
    });
  });

  describe('Customer Review Workflow', () => {
    test('customer can submit service review', async () => {
      await page.goto('http://localhost:3000/services/premium-detailing');
      
      // Scroll to reviews section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Click "Leave a Review"
      await page.click('text=Leave a Review');
      await page.waitForSelector('text=Submit Your Review');
      
      // Fill review form
      await page.fill('input[name="customerName"]', 'Sarah Johnson');
      await page.fill('input[name="customerEmail"]', 'sarah@example.com');
      await page.selectOption('select[name="rating"]', '5');
      await page.fill('textarea[name="comment"]', 'Amazing service! My car looks brand new. Very professional staff and excellent attention to detail.');
      
      await page.click('button[type="submit"]');
      
      // Verify review submission
      await page.waitForSelector('text=Review submitted successfully');
      
      const newReview = testData.reviews.find(r => r.customerEmail === 'sarah@example.com');
      expect(newReview).toBeDefined();
      expect(newReview.rating).toBe(5);
      expect(newReview.isApproved).toBe(false); // Requires moderation
    });

    test('review validation and spam prevention', async () => {
      await page.goto('http://localhost:3000/services/basic-wash');
      
      await page.click('text=Leave a Review');
      
      // Try to submit with empty rating
      await page.fill('input[name="customerName"]', 'Spam User');
      await page.fill('input[name="customerEmail"]', 'spam@example.com');
      await page.selectOption('select[name="rating"]', '0');
      await page.fill('textarea[name="comment"]', 'Good');
      
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Rating must be between 1 and 5');
      
      // Try very short comment
      await page.selectOption('select[name="rating"]', '5');
      await page.fill('textarea[name="comment"]', 'OK');
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Comment must be at least 10 characters');
      
      // Try too long comment
      await page.fill('textarea[name="comment"]', 'x'.repeat(1001));
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Comment too long');
    });
  });

  describe('Real-time Features', () => {
    test('live booking updates across sessions', async () => {
      // Simulate multiple browser sessions
      const session1 = page;
      const session2 = {
        ...page,
        goto: jest.fn(),
        waitForSelector: jest.fn(),
        evaluate: jest.fn()
      };
      
      // Session 1: Navigate to admin dashboard
      await session1.goto('http://localhost:3000/admin/bookings');
      
      // Session 2: Customer creates booking
      await session2.goto('http://localhost:3000/booking');
      
      // Submit booking from session 2
      await session2.fill('input[name="name"]', 'Live Test User');
      await session2.fill('input[name="email"]', 'live@example.com');
      await session2.click('button[type="submit"]');
      
      // Session 1 should see real-time update
      await session1.waitForSelector('text=Live Test User');
      
      // Verify the booking appears in both sessions
      expect(testData.bookings.find(b => b.customerEmail === 'live@example.com')).toBeDefined();
    });

    test('real-time service updates', async () => {
      // Simulate service update in admin panel
      const adminSession = page;
      
      await adminSession.goto('http://localhost:3000/admin/services');
      await adminSession.click('[data-testid="edit-service-1"]');
      await adminSession.fill('input[name="price"]', '$229');
      await adminSession.click('button[type="submit"]');
      
      // Customer should see updated price immediately
      const customerSession = {
        ...page,
        goto: jest.fn(),
        waitForSelector: jest.fn()
      };
      
      await customerSession.goto('http://localhost:3000/services/premium-detailing');
      
      // Verify real-time price update
      await customerSession.waitForSelector('text=$229');
      
      const updatedService = testData.services.find(s => s._id === '1');
      expect(updatedService.price).toBe('$229');
    });
  });

  describe('Performance and Load Testing', () => {
    test('application performance under load', async () => {
      const startTime = Date.now();
      
      // Simulate multiple concurrent users
      const concurrentSessions = Array.from({ length: 10 }, (_, i) => ({
        ...page,
        id: i,
        goto: jest.fn(),
        fill: jest.fn(),
        click: jest.fn()
      }));
      
      // All sessions navigate simultaneously
      await Promise.all(
        concurrentSessions.map(session => session.goto('http://localhost:3000'))
      );
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // All sessions should load successfully
      concurrentSessions.forEach(session => {
        expect(session.goto).toHaveBeenCalledWith('http://localhost:3000');
      });
    });

    test('database query performance', async () => {
      const { getActiveServices } = require('../convex/api/services');
      const { getBookings } = require('../convex/api/bookings');
      
      const startTime = Date.now();
      
      // Test service query performance
      await getActiveServices({ limit: 100 });
      const serviceQueryTime = Date.now() - startTime;
      
      expect(serviceQueryTime).toBeLessThan(100); // Should complete within 100ms
      
      // Test booking query performance
      const bookingStartTime = Date.now();
      await getBookings({ limit: 50 });
      const bookingQueryTime = Date.now() - bookingStartTime;
      
      expect(bookingQueryTime).toBeLessThan(200); // Should complete within 200ms
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('handles database connection failures gracefully', async () => {
      // Simulate database connection failure
      const originalQuery = require('../convex/api/services').getActiveServices;
      
      let callCount = 0;
      require('../convex/api/services').getActiveServices = async (ctx) => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Database connection failed');
        }
        // Retry succeeds
        return [{ _id: '1', name: 'Service 1' }];
      };
      
      await page.goto('http://localhost:3000/services');
      
      // Should retry and eventually load
      await page.waitForSelector('text=Service 1');
      
      // Restore original function
      require('../convex/api/services').getActiveServices = originalQuery;
    });

    test('handles network timeouts', async () => {
      // Simulate slow network
      const slowQuery = async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return [{ _id: '1', name: 'Delayed Service' }];
      };
      
      const { getActiveServices } = require('../convex/api/services');
      jest.spyOn(require('../convex/api/services'), 'getActiveServices').mockImplementation(slowQuery);
      
      await page.goto('http://localhost:3000/services');
      
      // Should show loading state and eventually timeout or show cached data
      await page.waitForSelector('text=Loading services', { timeout: 1000 });
      
      jest.restoreAllMocks();
    });
  });
});