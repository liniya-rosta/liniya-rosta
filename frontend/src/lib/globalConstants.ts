export const API_BASE_URL =
    typeof window === 'undefined'
        ? process.env.API_BASE_URL_INTERNAL || 'http://backend:8000'
        : process.env.NEXT_PUBLIC_API_BASE_URL || '/api';