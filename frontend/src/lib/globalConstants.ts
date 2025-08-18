export const API_BASE_URL =
    typeof window === 'undefined'
        ? process.env.API_BASE_URL_INTERNAL || 'http://backend:8000'
        : process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const IMG_BASE = process.env.NEXT_PUBLIC_IMG_SERVER || "http://backend:8000";

const wsBase = API_BASE_URL.replace(/^http/, "ws");
export const WS_URL = `${wsBase}/ws/online-chat`;
