const API_URL = '/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Request failed');
  }

  return response.json();
}

export const financeApi = {
  getExpenses: () => fetchWithAuth('/expenses'),
  addTransaction: (data: any) => fetchWithAuth('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
