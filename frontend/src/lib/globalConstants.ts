export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
export const IMG_BASE = process.env.NEXT_PUBLIC_IMG_SERVER ?? '/';

const wsBase = API_BASE_URL.replace(/^http/, "ws");
export const WS_URL = `${wsBase}/ws/online-chat`;
