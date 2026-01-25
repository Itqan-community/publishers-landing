import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the backend API URL based on the current environment
 * 
 * Environment mapping:
 * - production: https://api.itqan.dev
 * - staging: https://staging.api.itqan.dev
 * - development: https://develop.api.itqan.dev
 * 
 * Can be overridden with NEXT_PUBLIC_API_URL environment variable
 * Environment is determined by NEXT_PUBLIC_ENV (or NODE_ENV for production/development)
 */
export function getBackendUrl(): string {
  // Allow manual override via environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check for custom environment variable (for staging)
  const customEnv = process.env.NEXT_PUBLIC_ENV;
  if (customEnv === 'staging') {
    return 'https://staging.api.itqan.dev';
  }

  // Determine URL based on NODE_ENV (production or development)
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  switch (nodeEnv) {
    case 'production':
      return 'https://api.itqan.dev';
    case 'development':
    default:
      return 'https://develop.api.itqan.dev';
  }
}