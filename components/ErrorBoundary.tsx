"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

/**
 * Global Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the entire application.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<ErrorFallbackProps> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<ErrorFallbackProps> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, etc.
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an external service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: any) {
    // In a real application, you would send this to an error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      errorInfo: errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Example: Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example implementation:
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // }).catch(() => {
      //   // Silently fail if error reporting fails
      // });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Error Fallback Component
 * 
 * Displays when an error occurs and provides user-friendly error recovery options.
 */
interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Only show error details in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon and Message */}
        <div className="space-y-4">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Something went wrong
            </h2>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. Please try refreshing the page or contact us if the problem persists.
            </p>
          </div>
        </div>

        {/* Error Details (Development Only) */}
        {isDevelopment && showDetails && error && (
          <details className="text-left bg-muted p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-sm mb-2">
              Technical Details (Development Only)
            </summary>
            <div className="text-xs space-y-2">
              <div>
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="whitespace-pre-wrap text-xs mt-1 p-2 bg-background rounded border">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetError} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-2">
          <p>If this problem persists, please contact us:</p>
          <div className="space-y-1">
            <p><strong>Phone:</strong> (726) 207-1007</p>
            <p><strong>Email:</strong> rromerojr1@gmail.com</p>
          </div>
        </div>

        {/* Show Details Toggle (Development Only) */}
        {isDevelopment && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Custom Error Page for 404 and other HTTP errors
 */
export function NotFoundPage() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Page not found
            </h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              <Phone className="h-4 w-4 mr-2" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Error display component for inline error messages
 */
interface InlineErrorProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ error, onRetry, className = "" }: InlineErrorProps) {
  return (
    <div className={`flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 ${className}`}>
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm flex-1">{error}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 px-2 text-xs">
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * Hook for error handling in components
 */
export function useErrorHandler() {
  return {
    handleError: (error: Error, context?: string) => {
      console.error(`Error in ${context}:`, error);
      // In production, you would send this to an error reporting service
    }
  };
}

export default ErrorBoundary;