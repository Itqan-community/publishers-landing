/**
 * Next.js Instrumentation Hook
 * 
 * This file runs once when the Next.js server starts.
 * Use it for initialization code like disabling console logs in production.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export function register() {
  // Disable console.log and console.debug in production
  // Keep console.error and console.warn for production monitoring
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.debug = () => {};
  }
}
