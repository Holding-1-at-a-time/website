/**
 * Test setup configuration for Convex database integration
 * This file provides common setup utilities for all test files
 */

// Global test configuration
global.console = {
  ...console,
  // Mock console.log during tests to reduce noise
  log: jest.fn(),
  // Keep error logging for debugging
  error: console.error,
  warn: console.warn,
};

// Mock Next.js environment
global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  sessionStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  location: {
    href: 'http://localhost:3000',
    search: '',
    pathname: '/',
  },
  history: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
  },
};

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Test utilities
global.testUtils = {
  // Generate test data
  generateTestService: (overrides = {}) => ({
    name: "Test Service",
    slug: "test-service",
    category: "primary",
    title: "Test Service Title",
    description: "Test service description",
    metaDescription: "Test meta description",
    price: "$99",
    isActive: true,
    sortOrder: 1,
    ...overrides,
  }),

  generateTestBooking: (overrides = {}) => ({
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "(210) 555-0123",
    serviceId: "test-service-id",
    preferredDate: "2024-12-25",
    preferredTime: "2:00 PM",
    vehicleType: "sedan",
    message: "Test booking message",
    ...overrides,
  }),

  generateTestReview: (overrides = {}) => ({
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    rating: 5,
    comment: "Excellent service!",
    isFeatured: false,
    ...overrides,
  }),

  // Mock Convex client functions
  mockConvexQuery: jest.fn(),
  mockConvexMutation: jest.fn(),
};

// Setup cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

console.log('✅ Test setup completed');