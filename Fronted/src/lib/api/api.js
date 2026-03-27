//Este archivo se encarga de hacer las peticiones a la API, es decir, es el intermediario entre el frontend y el backend
//Aquí se pueden definir todas las funciones que necesitemos para interactuar con la API, como por ejemplo, obtener los productos, crear un nuevo producto, etc.
const BASE = 'http://localhost:4321'
//Esta parte del codigo se encarga de hacer las peticiones a la API, es decir, es el intermediario entre el frontend y el backend
const fetchJSON = (url,options = {}) => {
  return fetch(url, {...options,headers:{'content-Type':'application/json','Cache-Control':'no-cache', ...options.headers}})
  .then(res => res.json())
}

export const bookApi = {
  getAll: (params = {}) =>{
    const query =  new URLSearchParams(params).toString();
    const url = query ? `${BASE}/books?${query}`:`${BASE}/books`;
    return fetchJSON(url)
  } ,
  getOne: (id) => fetchJSON(`${BASE}/books/${id}`),
  create: (data) => fetchJSON(`${BASE}/books`,{method: 'POST',body: JSON.stringify(data)}),
  update: (id,data) => fetchJSON(`${BASE}/books/${id}`,{method: 'PATCH', body: JSON.stringify(data)}),
  delete: (id) => fetchJSON(`${BASE}/books/${id}`,{method:'DELETE'})
}

export const authorApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${BASE}/authors?${query}`: `${BASE}/authors`;
    return fetchJSON(url)
  },
  getOne: (id) => fetchJSON(`${BASE}/authors/${id}`),
  create: (data) => fetchJSON(`${BASE}/authors`, {method: 'POST', body: JSON.stringify(data)}),
  update: (id,data) => fetchJSON(`${BASE}/authors/${id}`, {method: 'PATCH', body: JSON.stringify(data)}), 
  delete: (id) => fetchJSON(`${BASE}/authors/${id}`, {method: 'DELETE'})
}