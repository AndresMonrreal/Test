const BASE = 'http://localhost:4321'

const fetchJSON = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      ...options.headers
    }
  }).then(res => res.json())
}

export const authApi = {
  register: (data) => fetchJSON(`${BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  login: (data) => fetchJSON(`${BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  getMe: (token) => fetchJSON(`${BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
