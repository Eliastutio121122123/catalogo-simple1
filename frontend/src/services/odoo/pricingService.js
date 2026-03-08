const SETTINGS_KEY = "catalogix_vendor_pricing_settings_v1";
const RULES_KEY = "catalogix_vendor_price_rules_v1";

const DEFAULT_SETTINGS = {
  currency: "DOP",
  defaultMarginPercent: 25,
  taxPercent: 18,
  roundTo: "integer",
  allowManualDiscounts: true,
  minPricePolicy: "cost_plus_margin",
};

const DEFAULT_RULES = [
  {
    id: 1,
    name: "Mayorista 10+ unidades",
    scope: "global",
    target: "Todos los productos",
    type: "percent",
    value: 8,
    minQty: 10,
    priority: 20,
    status: "active",
    updatedAt: "2026-03-01T12:00:00Z",
  },
  {
    id: 2,
    name: "Tecnologia Premium",
    scope: "category",
    target: "Tecnologia",
    type: "percent",
    value: 5,
    minQty: 1,
    priority: 30,
    status: "active",
    updatedAt: "2026-03-02T14:10:00Z",
  },
  {
    id: 3,
    name: "Liquidacion SKU-JSA-005",
    scope: "product",
    target: "JSA-005",
    type: "fixed",
    value: 250,
    minQty: 1,
    priority: 90,
    status: "inactive",
    updatedAt: "2026-03-03T09:45:00Z",
  },
];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return structuredClone(fallback);
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const pricingService = {
  getSettings: async () => {
    const data = read(SETTINGS_KEY, DEFAULT_SETTINGS);
    write(SETTINGS_KEY, data);
    return data;
  },

  saveSettings: async (payload) => {
    const current = await pricingService.getSettings();
    const next = {
      ...current,
      ...payload,
      defaultMarginPercent: Number(payload.defaultMarginPercent ?? current.defaultMarginPercent) || 0,
      taxPercent: Number(payload.taxPercent ?? current.taxPercent) || 0,
      allowManualDiscounts: Boolean(payload.allowManualDiscounts ?? current.allowManualDiscounts),
    };
    write(SETTINGS_KEY, next);
    return next;
  },

  listRules: async () => {
    const rules = read(RULES_KEY, DEFAULT_RULES);
    if (!Array.isArray(rules)) return [];
    const sorted = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    write(RULES_KEY, sorted);
    return sorted;
  },

  saveRule: async (rule) => {
    const rules = await pricingService.listRules();
    const id = rule?.id ? Number(rule.id) : Date.now();
    const normalized = {
      id,
      name: String(rule.name || "").trim(),
      scope: rule.scope || "global",
      target: String(rule.target || "").trim() || "Todos los productos",
      type: rule.type === "fixed" ? "fixed" : "percent",
      value: Number(rule.value) || 0,
      minQty: Number(rule.minQty) || 1,
      priority: Number(rule.priority) || 10,
      status: rule.status === "inactive" ? "inactive" : "active",
      updatedAt: new Date().toISOString(),
    };

    const idx = rules.findIndex((r) => Number(r.id) === id);
    if (idx >= 0) rules[idx] = normalized;
    else rules.unshift(normalized);

    write(RULES_KEY, rules);
    return normalized;
  },

  deleteRule: async (id) => {
    const rules = await pricingService.listRules();
    const next = rules.filter((r) => String(r.id) !== String(id));
    write(RULES_KEY, next);
    return true;
  },

  toggleRuleStatus: async (id) => {
    const rules = await pricingService.listRules();
    const next = rules.map((r) => {
      if (String(r.id) !== String(id)) return r;
      return { ...r, status: r.status === "active" ? "inactive" : "active", updatedAt: new Date().toISOString() };
    });
    write(RULES_KEY, next);
    return next.find((r) => String(r.id) === String(id)) || null;
  },
};

export default pricingService;
