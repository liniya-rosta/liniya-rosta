export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const wsBase = API_BASE_URL.replace(/^http/, "ws");
export const WS_URL = `${wsBase}/ws/online-chat`;