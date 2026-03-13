import { api } from "./odooClient";

const TOKEN_KEY = "catalogix_token";
const REFRESH_KEY = "catalogix_refresh_token";
const USER_KEY  = "catalogix_user";

// ─── Helpers de almacenamiento ────────────────────────────────────────────────
const saveSession  = (token, user, refreshToken = "") => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

// ─── Auth Service ─────────────────────────────────────────────────────────────
const authService = {

  /**
   * Inicia sesión contra Flask → Odoo.
   * Retorna el usuario y guarda el token en localStorage.
   */
  login: async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    saveSession(data.token, data.user, data.refresh_token);
    return data.user;
  },

  /**
   * Registra un nuevo usuario.
   */
  register: async ({ name, email, password, role = "customer", phone = "", company = "" }) => {
    const data = await api.post("/api/auth/register", {
      name,
      email,
      password,
      role,
      phone,
      company,
    });
    return data;
  },

  /**
   * Cierra sesión — borra el token local y notifica al backend.
   */
  logout: async () => {
    try { await api.post("/api/auth/logout"); } catch (_) { /* silencioso */ }
    clearSession();
  },

  /**
   * Retorna el usuario guardado en localStorage (sin llamar al backend).
   */
  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  /**
   * Retorna true si hay un token activo en localStorage.
   */
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  /**
   * Solicita recuperación de contraseña.
   */
  forgotPassword: async (email) => {
    return await api.post("/api/auth/forgot-password", { email });
  },

  /**
   * Restablece la contraseña con el token del email.
   */
  resetPassword: async (token, newPassword) => {
    return await api.post("/api/auth/reset-password", { token, password: newPassword });
  },

  /**
   * Valida si el token de recuperacion sigue siendo valido.
   */
  validateResetToken: async (token) => {
    return await api.post("/api/auth/validate-reset-token", { token });
  },

  /**
   * Verifica el email con el código recibido.
   */
  verifyEmail: async (code) => {
    return await api.post("/api/auth/verify-email", { code });
  },
};

export default authService;
