
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Database, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorType?: 'database' | 'network' | 'permission' | 'generic';
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorType = ErrorBoundary.categorizeError(error);
    return { hasError: true, error, errorType };
  }

  static categorizeError(error: Error): 'database' | 'network' | 'permission' | 'generic' {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('42p01') || message.includes('does not exist')) {
      return 'database';
    }
    if (message.includes('42501') || message.includes('permission denied')) {
      return 'permission';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    return 'generic';
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
      errorType: ErrorBoundary.categorizeError(error)
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorType: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  getErrorContent() {
    const { errorType, error } = this.state;
    
    switch (errorType) {
      case 'database':
        return {
          icon: <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
          title: 'Database Connection Issue',
          description: 'The application cannot connect to the database. This may be due to missing tables or configuration issues.',
          color: 'blue',
          suggestion: 'Please check the database setup and ensure all tables are properly configured.'
        };
      
      case 'permission':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
          title: 'Access Permission Required',
          description: 'You do not have permission to access this resource. Authentication may be required.',
          color: 'yellow',
          suggestion: 'Please sign in or contact your administrator for access.'
        };
      
      case 'network':
        return {
          icon: <Wifi className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
          title: 'Network Connection Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          color: 'orange',
          suggestion: 'Try refreshing the page or check your network connection.'
        };
      
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />,
          title: 'Something went wrong',
          description: 'An unexpected error occurred in the application.',
          color: 'red',
          suggestion: 'Please try refreshing the page or contact support if the problem persists.'
        };
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorContent = this.getErrorContent();

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                {errorContent.icon}
              </div>
              <CardTitle className={`text-${errorContent.color}-600 dark:text-${errorContent.color}-400`}>
                {errorContent.title}
              </CardTitle>
              <Badge variant="outline" className="mt-2">
                Error Type: {this.state.errorType}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {errorContent.description}
              </p>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Suggestion:</strong> {errorContent.suggestion}
                </p>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={this.handleReset} 
                  variant="outline" 
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload} 
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
