import { getToken } from './auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function apiFetch<T>(input: RequestInfo, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ... (init.headers as Record<string,string> || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    // пробросим тело ошибки
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw err;
  }
  return res.json();
}