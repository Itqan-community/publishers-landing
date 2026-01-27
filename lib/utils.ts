import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get default headers for API requests
 * Includes Accept-Language: ar for all requests
 */
export function getApiHeaders(additionalHeaders?: Record<string, string>): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar',
    ...additionalHeaders,
  };
}

/**
 * Get the backend API URL based on the current environment
 * 
 * Environment mapping (based on API docs):
 * - production: https://api.cms.itqan.dev
 * - staging: https://staging.api.cms.itqan.dev
 * - development: https://develop.api.cms.itqan.dev
 * 
 * Can be overridden with NEXT_PUBLIC_API_URL environment variable
 * Environment is determined by NEXT_PUBLIC_ENV (or NODE_ENV for production/development)
 * 
 * TEMPORARY: Always returns development URL for testing purposes
 */
export function getBackendUrl(): string {
  // TEMPORARY: Always return development URL for testing
  return 'https://develop.api.cms.itqan.dev';
  
  // Allow manual override via environment variable
  // if (process.env.NEXT_PUBLIC_API_URL) {
  //   return process.env.NEXT_PUBLIC_API_URL;
  // }

  // Check for custom environment variable (for staging)
  // const customEnv = process.env.NEXT_PUBLIC_ENV;
  // if (customEnv === 'staging') {
  //   return 'https://staging.api.cms.itqan.dev';
  // }

  // Determine URL based on NODE_ENV (production or development)
  // const nodeEnv = process.env.NODE_ENV || 'development';
  // 
  // switch (nodeEnv) {
  //   case 'production':
  //     return 'https://api.cms.itqan.dev';
  //   case 'development':
  //   default:
  //     return 'https://develop.api.cms.itqan.dev';
  // }
}