const STORAGE_KEY = "catalogix_vendor_notifications_v1";

const DEFAULT_NOTIFICATIONS = [
  { id: 1, title: "Nuevo pedido #1204", body: "Tienes un nuevo pedido pendiente de confirmacion.", type: "order", read: false, createdAt: "2026-03-05T14:20:00Z" },
  { id: 2, title: "Stock bajo: JSA-005", body: "El producto JSA-005 llego al minimo de stock.", type: "inventory", read: false, createdAt: "2026-03-05T12:02:00Z" },
  { id: 3, title: "Factura pagada", body: "La factura INV-2026-0002 fue pagada exitosamente.", type: "invoice", read: true, createdAt: "2026-03-04T16:44:00Z" },
];

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return [...DEFAULT_NOTIFICATIONS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_NOTIFICATIONS];
  } catch {
    return [...DEFAULT_NOTIFICATIONS];
  }
}

function writeStore(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

const notificationService = {
  list: async () => {
    const rows = readStore();
    return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markRead: async (id) => {
    const rows = readStore().map((n) => (String(n.id) === String(id) ? { ...n, read: true } : n));
    writeStore(rows);
    return rows.find((n) => String(n.id) === String(id)) || null;
  },

  markAllRead: async () => {
    const rows = readStore().map((n) => ({ ...n, read: true }));
    writeStore(rows);
    return true;
  },

  delete: async (id) => {
    const rows = readStore().filter((n) => String(n.id) !== String(id));
    writeStore(rows);
    return true;
  },
};

export default notificationService;
