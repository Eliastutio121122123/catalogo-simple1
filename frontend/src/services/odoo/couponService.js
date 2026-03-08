const STORAGE_KEY = "catalogix_vendor_coupons_v1";

const DEFAULT_COUPONS = [
  { id: 1, code: "VERANO25", type: "percent", value: 25, minOrder: 1500, maxDiscount: 800, uses: 48, maxUses: 100, expiresAt: "2026-12-31", status: "active", catalogs: [1, 2], description: "25% de descuento en toda la tienda" },
  { id: 2, code: "BIENVENIDO", type: "percent", value: 15, minOrder: 500, maxDiscount: null, uses: 124, maxUses: null, expiresAt: null, status: "active", catalogs: [], description: "Descuento de bienvenida para nuevos clientes" },
  { id: 3, code: "FIJO200", type: "fixed", value: 200, minOrder: 1000, maxDiscount: null, uses: 31, maxUses: 50, expiresAt: "2025-02-28", status: "inactive", catalogs: [3], description: "RD$200 de descuento en belleza" },
  { id: 4, code: "VIP50", type: "percent", value: 50, minOrder: 5000, maxDiscount: 2000, uses: 8, maxUses: 20, expiresAt: "2026-09-15", status: "active", catalogs: [1], description: "Descuento VIP para clientes frecuentes" },
  { id: 5, code: "FLASH10", type: "fixed", value: 100, minOrder: null, maxDiscount: null, uses: 0, maxUses: 200, expiresAt: "2026-10-30", status: "inactive", catalogs: [], description: "Cupon flash para promocion especial" },
  { id: 6, code: "TECH15", type: "percent", value: 15, minOrder: 3000, maxDiscount: 1500, uses: 19, maxUses: null, expiresAt: "2026-08-01", status: "active", catalogs: [5], description: "15% en electronica y gadgets" },
];

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
      return [...DEFAULT_COUPONS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_COUPONS];
  } catch {
    return [...DEFAULT_COUPONS];
  }
}

function writeStore(coupons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
}

function todayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function withDerivedStatus(coupon) {
  if (!coupon.expiresAt) return coupon;
  const exp = new Date(`${coupon.expiresAt}T00:00:00`);
  if (coupon.status === "active" && exp < todayDateOnly()) {
    return { ...coupon, status: "expired" };
  }
  return coupon;
}

function normalizeCoupon(input, existing = null) {
  return {
    id: existing?.id ?? Date.now(),
    code: String(input.code || "").trim().toUpperCase(),
    description: String(input.description || "").trim(),
    type: input.type === "fixed" ? "fixed" : "percent",
    value: Number(input.value) || 0,
    minOrder: input.minOrder === "" || input.minOrder == null ? null : Number(input.minOrder),
    maxDiscount: input.maxDiscount === "" || input.maxDiscount == null ? null : Number(input.maxDiscount),
    maxUses: input.maxUses === "" || input.maxUses == null ? null : Number(input.maxUses),
    maxUsesPerUser: input.maxUsesPerUser === "" || input.maxUsesPerUser == null ? 1 : Number(input.maxUsesPerUser),
    expiresAt: input.expiresAt || null,
    status: input.status === "inactive" ? "inactive" : (existing?.status === "expired" ? "expired" : "active"),
    catalogs: Array.isArray(input.catalogs) ? input.catalogs : [],
    onePerCustomer: Boolean(input.onePerCustomer),
    newCustomersOnly: Boolean(input.newCustomersOnly),
    uses: existing?.uses ?? 0,
  };
}

const couponService = {
  list: async () => {
    const coupons = readStore().map(withDerivedStatus);
    writeStore(coupons);
    return coupons;
  },

  getById: async (id) => {
    const coupons = await couponService.list();
    return coupons.find(c => String(c.id) === String(id)) || null;
  },

  save: async (payload) => {
    const coupons = readStore();
    const idx = payload?.id ? coupons.findIndex(c => String(c.id) === String(payload.id)) : -1;
    if (idx >= 0) {
      coupons[idx] = normalizeCoupon(payload, coupons[idx]);
    } else {
      coupons.unshift(normalizeCoupon(payload, null));
    }
    writeStore(coupons);
    return idx >= 0 ? coupons[idx] : coupons[0];
  },

  delete: async (id) => {
    const coupons = readStore().filter(c => String(c.id) !== String(id));
    writeStore(coupons);
    return true;
  },

  toggleStatus: async (id) => {
    const coupons = readStore().map(c => {
      if (String(c.id) !== String(id)) return c;
      if (c.status === "expired") return c;
      return { ...c, status: c.status === "active" ? "inactive" : "active" };
    });
    writeStore(coupons);
    return coupons.find(c => String(c.id) === String(id)) || null;
  },

  duplicate: async (id) => {
    const coupons = readStore();
    const source = coupons.find(c => String(c.id) === String(id));
    if (!source) return null;
    const duplicated = {
      ...source,
      id: Date.now(),
      code: `${source.code}_COPIA`,
      uses: 0,
      status: "inactive",
    };
    coupons.unshift(duplicated);
    writeStore(coupons);
    return duplicated;
  },
};

export default couponService;
