const STORAGE_KEY = "catalogix_vendor_promotions_v1";

const DEFAULT_PROMOTIONS = [
  {
    id: 1,
    name: "Promo Fin de Mes",
    code: "FINMES20",
    type: "percent",
    value: 20,
    minOrder: 1500,
    maxDiscount: 1200,
    appliesTo: "all",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    usageLimit: 300,
    usedCount: 42,
    status: "active",
    description: "Descuento general por cierre de mes",
  },
  {
    id: 2,
    name: "Envio Gratis Premium",
    code: "SHIPFREE",
    type: "shipping",
    value: 0,
    minOrder: 3000,
    maxDiscount: null,
    appliesTo: "catalog",
    startDate: "2026-03-05",
    endDate: "2026-04-05",
    usageLimit: 100,
    usedCount: 9,
    status: "inactive",
    description: "Envio gratis en catalogos premium",
  },
];

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROMOTIONS));
      return [...DEFAULT_PROMOTIONS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_PROMOTIONS];
  } catch {
    return [...DEFAULT_PROMOTIONS];
  }
}

function writeStore(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function normalize(input, existing = null) {
  return {
    id: existing?.id ?? Date.now(),
    name: String(input.name || "").trim(),
    code: String(input.code || "").trim().toUpperCase(),
    type: ["percent", "fixed", "shipping"].includes(input.type) ? input.type : "percent",
    value: Number(input.value) || 0,
    minOrder: input.minOrder === "" || input.minOrder == null ? null : Number(input.minOrder),
    maxDiscount: input.maxDiscount === "" || input.maxDiscount == null ? null : Number(input.maxDiscount),
    appliesTo: input.appliesTo || "all",
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    usageLimit: input.usageLimit === "" || input.usageLimit == null ? null : Number(input.usageLimit),
    usedCount: existing?.usedCount ?? 0,
    status: input.status === "inactive" ? "inactive" : "active",
    description: String(input.description || "").trim(),
  };
}

const promotionService = {
  list: async () => {
    const rows = readStore();
    return [...rows].sort((a, b) => Number(b.id) - Number(a.id));
  },

  getById: async (id) => {
    const rows = await promotionService.list();
    return rows.find((r) => String(r.id) === String(id)) || null;
  },

  save: async (payload) => {
    const rows = readStore();
    const idx = payload?.id ? rows.findIndex((r) => String(r.id) === String(payload.id)) : -1;
    if (idx >= 0) rows[idx] = normalize(payload, rows[idx]);
    else rows.unshift(normalize(payload));
    writeStore(rows);
    return idx >= 0 ? rows[idx] : rows[0];
  },

  delete: async (id) => {
    const rows = readStore().filter((r) => String(r.id) !== String(id));
    writeStore(rows);
    return true;
  },

  toggleStatus: async (id) => {
    const rows = readStore().map((r) => {
      if (String(r.id) !== String(id)) return r;
      return { ...r, status: r.status === "active" ? "inactive" : "active" };
    });
    writeStore(rows);
    return rows.find((r) => String(r.id) === String(id)) || null;
  },
};

export default promotionService;
