import type { ApiResponse } from '../types/index';

// Базовый URL для всех запросов к серверу
const API_BASE_URL = '/api';

// Ключ, под которым в localStorage хранится JWT
const STORAGE_KEY = 'token';

// Получаем JWT из localStorage
function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

// Универсальная обёртка вокруг fetch, которая:
// 1) Добавляет нужные заголовки (Content-Type, Authorization при наличии токена).
// 2) Парсит JSON-ответ.
// 3) Выбрасывает ошибку при статусе !== 2xx.
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  // Собираем заголовки
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>), // приоритет полям из options
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Выполняем запрос
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Парсим тело ответа как JSON
  const data = await response.json();

  // Если статус не ок, выбрасываем ошибку с тем сообщением, которое пришло с сервера
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data as ApiResponse<T>;
}

// Экспортируем объект с методами для всех сущностей API
export const apiClient = {
  // Аутентификация
  auth: {
    register: (userData: { email: string; password: string; name: string }) =>
      fetchWithAuth<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    login: (credentials: { email: string; password: string }) =>
      fetchWithAuth<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    getCurrentUser: () =>
      fetchWithAuth<any>('/auth/me'),
  },

  // Пользователи
  users: {
    getAll: () =>
      fetchWithAuth<any[]>('/users'),

    getById: (id: string) =>
      fetchWithAuth<any>(`/users/${id}`),

    update: (id: string, userData: any) =>
      fetchWithAuth<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    delete: (id: string) =>
      fetchWithAuth<void>(`/users/${id}`, {
        method: 'DELETE',
      }),
      changePassword: (id: string, payload: { currentPassword: string; newPassword: string }) =>
      fetchWithAuth<void>(`/users/${id}/password`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Компьютеры
  computers: {
    getAll: () =>
      fetchWithAuth<any[]>('/computers'),

    getById: (id: string) =>
      fetchWithAuth<any>(`/computers/${id}`),

    create: (computerData: any) =>
      fetchWithAuth<any>('/computers', {
        method: 'POST',
        body: JSON.stringify(computerData),
      }),

    update: (id: string, computerData: any) =>
      fetchWithAuth<any>(`/computers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(computerData),
      }),

    delete: (id: string) =>
      fetchWithAuth<void>(`/computers/${id}`, {
        method: 'DELETE',
      }),
  },

  // Бронирования
  bookings: {
    getAll: () =>
      fetchWithAuth<any[]>('/bookings'),

    getById: (id: string) =>
      fetchWithAuth<any>(`/bookings/${id}`),

    create: (bookingData: any) =>
      fetchWithAuth<any>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }),

    update: (id: string, bookingData: any) =>
      fetchWithAuth<any>(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookingData),
      }),

    cancel: (id: string) =>
      fetchWithAuth<any>(`/bookings/${id}/cancel`, {
        method: 'POST',
      }),
  },

  // Аналитика
  analytics: {
    getOverview: () =>
      fetchWithAuth<any>('/analytics'),
  },
};