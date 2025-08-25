const PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://liniya-rosta.com';
const PUBLIC_API_PATH = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const isServer = typeof window === 'undefined';

export const API_BASE_URL = isServer
    ? `${PUBLIC_BASE}${PUBLIC_API_PATH}`
    : PUBLIC_API_PATH;

export const IMG_BASE = process.env.NEXT_PUBLIC_IMG_SERVER || PUBLIC_BASE;

const wsBase = (isServer ? `${PUBLIC_BASE}${PUBLIC_API_PATH}` : PUBLIC_API_PATH)
    .replace(/^http/, 'ws');
export const WS_URL = `${wsBase}/ws/online-chat`;