
// Utility functions for safe async operations and error handling

export interface AsyncResult<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Safely execute an async function and return a result object
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<AsyncResult<T>> {
  try {
    const data = await asyncFn();
    return { data, success: true };
  } catch (error) {
    console.error(errorMessage, error);
    const errorString = error instanceof Error ? error.message : String(error);
    return { 
      error: errorString, 
      success: false 
    };
  }
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryAsync<T>(
  asyncFn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), waitMs);
  };
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(requiredVars: string[]): string[] {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
  }
  return missing;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred';
}
