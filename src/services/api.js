// Base URL — points to our Node.js backend
const BASE_URL = 'http://localhost:3001';

// ─── Core fetch wrapper ──────────────────────────────────────
async function request(path, options = {}) {
  const { signal, ...rest } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    signal,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('swiggy_session_expired'));
    }
    throw new Error('Session expired');
  }

  if (res.status === 429) {
    const e = new Error('Rate limited');
    e.code = 429;
    throw e;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `Request failed: ${path}`);
  }

  return res.json();
}

export const auth = {
  getLoginUrl: () => request('/auth/swiggy/login'),
  handleCallback: (code, state) =>
    request('/auth/swiggy/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    }),
  getStatus: () => request('/auth/swiggy/status'),
  logout: () => request('/auth/swiggy/logout', { method: 'POST' }),
};

export const concierge = {
  search: (query) =>
    request('/mcp/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  getMenu: (restaurantId) => request(`/mcp/menu/${restaurantId}`),
};

export const cart = {
  addItem: (item) =>
    request('/mcp/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  get: () => request('/mcp/cart'),
};

export const orders = {
  getAll: () => request('/mcp/orders'),
  place: (params) =>
    request('/mcp/order/place', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};

export const addresses = {
  getAll: () => request('/mcp/addresses'),
};
