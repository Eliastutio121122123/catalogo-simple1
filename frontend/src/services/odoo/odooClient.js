const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Cliente HTTP base.
 * Agrega automáticamente el token JWT si existe en localStorage.
 */
async function request(method, endpoint, body = null) {
  const token = localStorage.getItem("catalogix_token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  // Backend esperado: { ok: true, data } o { ok: false, error }.
  if (!res.ok) {
    throw new Error((data && data.error) || res.statusText || "Error de red");
  }
  if (!data || !data.ok) {
    throw new Error((data && data.error) || "Respuesta invalida del servidor");
  }

  return data.data;
}

export const api = {
  get:    (endpoint)        => request("GET",    endpoint),
  post:   (endpoint, body)  => request("POST",   endpoint, body),
  put:    (endpoint, body)  => request("PUT",    endpoint, body),
  patch:  (endpoint, body)  => request("PATCH",  endpoint, body),
  delete: (endpoint)        => request("DELETE", endpoint),
};
