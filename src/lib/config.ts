// Configuration for environment-specific variables

// API URLs
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Feature flags
export const ENABLE_DEBUG_LOGGING = process.env.NODE_ENV !== 'production';
