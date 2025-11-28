/**
 * Tests for Convex validation system
 * Validates input sanitization, data integrity, and business rules
 */

describe('Convex Validation System', () => {
  
  describe('Input Validation', () => {
    const { validateEmail, validatePhone, validateDate, validateTime, validateSlug, validatePrice } = 
      require('../convex/validators');

    describe('Email Validation', () => {
      test('should validate correct email formats', () => {
        const validEmails = [
          'user@example.com',
          'test.email@domain.co',
          'name+tag@company.org',
          'user123@subdomain.example.com'
        ];

        validEmails.forEach(email => {
          expect(validateEmail(email)).toBe(true);
        });
      });

      test('should reject invalid email formats', () => {
        const invalidEmails = [
          'invalid-email',
          '@domain.com',
          'user@',
          'user..double.dot@example.com',
          'user@domain',
          ''
        ];

        invalidEmails.forEach(email => {
          expect(validateEmail(email)).toBe(false);
        });
      });

      test('should handle edge cases', () => {
        expect(validateEmail(null)).toBe(false);
        expect(validateEmail(undefined)).toBe(false);
        expect(validateEmail(123)).toBe(false);
        expect(validateEmail('a'.repeat(256))).toBe(false); // Too long
      });
    });

    describe('Phone Validation', () => {
      test('should validate correct phone formats', () => {
        const validPhones = [
          '(210) 555-0123',
          '210-555-0123',
          '2105550123',
          '+1-210-555-0123',
          '+1 (210) 555-0123'
        ];

        validPhones.forEach(phone => {
          expect(validatePhone(phone)).toBe(true);
        });
      });

      test('should reject invalid phone formats', () => {
        const invalidPhones = [
          '123',
          'abc-def-ghij',
          '(210) 555-012', // Too short
          '210-555-01234', // Too long
          ''
        ];

        invalidPhones.forEach(phone => {
          expect(validatePhone(phone)).toBe(false);
        });
      });
    });

    describe('Date Validation', () => {
      test('should validate correct date formats (YYYY-MM-DD)', () => {
        const validDates = [
          '2024-12-25',
          '2024-01-01',
          '2024-06-15',
          '2024-02-29' // Valid leap year date
        ];

        validDates.forEach(date => {
          expect(validateDate(date)).toBe(true);
        });
      });

      test('should reject invalid date formats', () => {
        const invalidDates = [
          '2024/12/25', // Wrong separator
          '25-12-2024', // Wrong order
          '2024-13-01', // Invalid month
          '2024-02-30', // Invalid day
          '24-12-25',   // Wrong year format
          ''
        ];

        invalidDates.forEach(date => {
          expect(validateDate(date)).toBe(false);
        });
      });

      test('should handle edge cases', () => {
        expect(validateDate(null)).toBe(false);
        expect(validateDate(undefined)).toBe(false);
        expect(validateDate('2024-02-28')).toBe(true);
        expect(validateDate('2024-02-29')).toBe(true); // Leap year
        expect(validateDate('2023-02-29')).toBe(false); // Non-leap year
      });
    });

    describe('Time Validation', () => {
      test('should validate correct time formats', () => {
        const validTimes = [
          '2:00 PM',
          '10:30 AM',
          '12:00 PM',
          '12:00 AM',
          '11:59 PM',
          '1:01 AM'
        ];

        validTimes.forEach(time => {
          expect(validateTime(time)).toBe(true);
        });
      });

      test('should reject invalid time formats', () => {
        const invalidTimes = [
          '25:00 PM', // Invalid hour
          '2:60 PM',  // Invalid minute
          '14:00 PM', // 24-hour format (should be 2:00 PM)
          '2:00 XM',  // Invalid AM/PM
          '2 PM',     // Missing minutes
          '2:00',     // Missing AM/PM
          ''
        ];

        invalidTimes.forEach(time => {
          expect(validateTime(time)).toBe(false);
        });
      });
    });

    describe('Slug Validation', () => {
      test('should validate correct slug formats', () => {
        const validSlugs = [
          'auto-detailing',
          'paint-correction',
          'ceramic-coating',
          'interior-cleaning',
          'premium-service'
        ];

        validSlugs.forEach(slug => {
          expect(validateSlug(slug)).toBe(true);
        });
      });

      test('should reject invalid slug formats', () => {
        const invalidSlugs = [
          'Auto Detailing', // Contains spaces
          'auto.detailing', // Contains dots
          'auto_detailing', // Contains underscores
          '-auto-detailing', // Starts with hyphen
          'auto-detailing-', // Ends with hyphen
          '--auto--detailing--', // Double hyphens
          'auto detailing', // Spaces instead of hyphens
          'AutoDetailing', // Mixed case
          'auto@detailing', // Contains special characters
          ''
        ];

        invalidSlugs.forEach(slug => {
          expect(validateSlug(slug)).toBe(false);
        });
      });

      test('should handle length constraints', () => {
        expect(validateSlug('a'.repeat(50))).toBe(true); // Valid length
        expect(validateSlug('a'.repeat(101))).toBe(false); // Too long
        expect(validateSlug('a')).toBe(true); // Minimum length
      });
    });

    describe('Price Validation', () => {
      test('should validate correct price formats', () => {
        const validPrices = [
          '$99',
          '$99.99',
          '$1000',
          '99',
          '99.99',
          '$99+'
        ];

        validPrices.forEach(price => {
          expect(validatePrice(price)).toBe(true);
        });
      });

      test('should reject invalid price formats', () => {
        const invalidPrices = [
          '$-99', // Negative
          '99.999', // Too many decimals
          '$', // Just symbol
          'free', // Text instead of number
          '$abc', // Non-numeric
          ''
        ];

        invalidPrices.forEach(price => {
          expect(validatePrice(price)).toBe(false);
        });
      });
    });
  });

  describe('Business Rule Validation', () => {
    const { validateBookingConstraints, validateServiceConstraints, validateReviewConstraints } = 
      require('../convex/validators');

    describe('Booking Constraints', () => {
      test('should validate booking time constraints', () => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        // Business hours: 7 AM (420) to 10 PM (1320)
        expect(validateBookingConstraints({
          preferredTime: '9:00 AM',
          preferredDate: '2024-12-25'
        })).toBe(true);

        expect(validateBookingConstraints({
          preferredTime: '11:00 PM',
          preferredDate: '2024-12-25'
        })).toBe(false);
      });

      test('should validate advance booking requirements', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        expect(validateBookingConstraints({
          preferredDate: tomorrowStr,
          preferredTime: '9:00 AM'
        })).toBe(true);

        // Same day booking should fail
        const today = new Date().toISOString().split('T')[0];
        expect(validateBookingConstraints({
          preferredDate: today,
          preferredTime: '9:00 AM'
        })).toBe(false);
      });
    });

    describe('Service Constraints', () => {
      test('should validate service category constraints', () => {
        expect(validateServiceConstraints({
          category: 'primary',
          name: 'Premium Service'
        })).toBe(true);

        expect(validateServiceConstraints({
          category: 'additional',
          name: 'Add-on Service'
        })).toBe(true);

        expect(validateServiceConstraints({
          category: 'invalid-category',
          name: 'Invalid Service'
        })).toBe(false);
      });

      test('should validate service name uniqueness', () => {
        // This would typically check against existing services in the database
        // For testing, we'll simulate the constraint
        const existingServices = [
          { name: 'Premium Detailing', slug: 'premium-detailing' },
          { name: 'Basic Wash', slug: 'basic-wash' }
        ];

        expect(validateServiceConstraints({
          name: 'New Service',
          slug: 'new-service',
          existingServices
        })).toBe(true);

        expect(validateServiceConstraints({
          name: 'Premium Detailing', // Duplicate name
          slug: 'different-slug',
          existingServices
        })).toBe(false);
      });
    });

    describe('Review Constraints', () => {
      test('should validate rating constraints', () => {
        expect(validateReviewConstraints({
          rating: 5,
          comment: 'Excellent service!'
        })).toBe(true);

        expect(validateReviewConstraints({
          rating: 1,
          comment: 'Poor service'
        })).toBe(true);

        expect(validateReviewConstraints({
          rating: 0, // Invalid rating
          comment: 'No rating'
        })).toBe(false);

        expect(validateReviewConstraints({
          rating: 6, // Invalid rating
          comment: 'Too high'
        })).toBe(false);
      });

      test('should validate comment content', () => {
        expect(validateReviewConstraints({
          rating: 5,
          comment: 'Great service, very professional!'
        })).toBe(true);

        expect(validateReviewConstraints({
          rating: 5,
          comment: '' // Empty comment
        })).toBe(false);

        expect(validateReviewConstraints({
          rating: 5,
          comment: 'x'.repeat(1001) // Too long
        })).toBe(false);
      });
    });
  });

  describe('Data Sanitization', () => {
    const { sanitizeInput, sanitizeHTML } = require('../convex/validators');

    test('should sanitize string inputs', () => {
      const dirtyInput = '  <script>alert("xss")</script>Test Input  ';
      const sanitized = sanitizeInput(dirtyInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toBe('Test Input');
    });

    test('should handle HTML sanitization', () => {
      const dirtyHTML = '<p>Hello <b>world</b></p><script>alert("xss")</script>';
      const sanitized = sanitizeHTML(dirtyHTML);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('<p>Hello <b>world</b></p>');
    });

    test('should trim whitespace', () => {
      expect(sanitizeInput('  trimmed  ')).toBe('trimmed');
      expect(sanitizeInput('\t\nwhitespace\n\t')).toBe('whitespace');
    });

    test('should preserve safe characters', () => {
      const safeInput = 'Hello-World_123@example.com';
      expect(sanitizeInput(safeInput)).toBe(safeInput);
    });
  });

  describe('Security Validation', () => {
    const { validateRateLimit, validateCSRFToken, validateAdminAccess } = 
      require('../convex/validators');

    test('should enforce rate limiting', () => {
      const userActions = [
        { timestamp: Date.now() - 30000 }, // 30 seconds ago
        { timestamp: Date.now() - 20000 }, // 20 seconds ago
        { timestamp: Date.now() - 10000 }  // 10 seconds ago
      ];

      // Should allow if under limit
      expect(validateRateLimit(userActions, 5, 60000)).toBe(true);

      // Should reject if over limit
      const tooManyActions = Array(6).fill(null).map((_, i) => ({
        timestamp: Date.now() - (i * 5000)
      }));

      expect(validateRateLimit(tooManyActions, 5, 60000)).toBe(false);
    });

    test('should validate CSRF tokens', () => {
      const validToken = 'valid-csrf-token';
      const sessionToken = 'valid-csrf-token';

      expect(validateCSRFToken(validToken, sessionToken)).toBe(true);
      expect(validateCSRFToken('invalid-token', sessionToken)).toBe(false);
    });

    test('should validate admin access', () => {
      const adminUser = { id: 'admin-id', isAdmin: true, role: 'admin' };
      const regularUser = { id: 'user-id', isAdmin: false, role: 'user' };
      const guestUser = null;

      expect(validateAdminAccess(adminUser)).toBe(true);
      expect(validateAdminAccess(regularUser)).toBe(false);
      expect(validateAdminAccess(guestUser)).toBe(false);
    });
  });
});