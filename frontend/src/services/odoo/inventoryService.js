const PRODUCTS_KEY = "catalogix_inventory_products_v1";
const MOVEMENTS_KEY = "catalogix_inventory_movements_v1";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Vestido Floral Verano", sku: "VFV-001", catalog: "Nova Style", category: "Moda", stock: 8, minStock: 5, status: "active" },
  { id: 2, name: "Blazer Oversize Gris", sku: "BOG-002", catalog: "Nova Style", category: "Moda", stock: 14, minStock: 5, status: "active" },
  { id: 3, name: "Tenis Running Nike Air", sku: "TNA-003", catalog: "FitLife Store", category: "Deportes", stock: 3, minStock: 5, status: "active" },
  { id: 4, name: "Serum Vitamina C", sku: "SVC-004", catalog: "Glam Beauty Box", category: "Belleza", stock: 22, minStock: 8, status: "active" },
  { id: 5, name: "Jeans Slim Azul", sku: "JSA-005", catalog: "Nova Style", category: "Moda", stock: 0, minStock: 4, status: "inactive" },
  { id: 6, name: "Set Yoga Premium", sku: "SYP-006", catalog: "FitLife Store", category: "Deportes", stock: 5, minStock: 5, status: "active" },
  { id: 7, name: "Cafe Organico Especial", sku: "COE-007", catalog: "Gourmet RD", category: "Alimentos", stock: 34, minStock: 10, status: "active" },
  { id: 8, name: "Altavoz Bluetooth JBL", sku: "ABJ-012", catalog: "Tech Plus", category: "Electronica", stock: 6, minStock: 4, status: "active" },
];

const DEFAULT_MOVEMENTS = [
  { id: 1001, productId: 1, productName: "Vestido Floral Verano", sku: "VFV-001", type: "in", quantity: 10, beforeStock: 0, afterStock: 10, note: "Carga inicial", reference: "INIT-001", user: "Vendedor", createdAt: "2026-03-01T09:15:00Z" },
  { id: 1002, productId: 3, productName: "Tenis Running Nike Air", sku: "TNA-003", type: "out", quantity: 2, beforeStock: 5, afterStock: 3, note: "Pedido #1042", reference: "ORD-1042", user: "Sistema", createdAt: "2026-03-02T14:20:00Z" },
  { id: 1003, productId: 5, productName: "Jeans Slim Azul", sku: "JSA-005", type: "adjust", quantity: -3, beforeStock: 3, afterStock: 0, note: "Ajuste por merma", reference: "ADJ-5001", user: "Vendedor", createdAt: "2026-03-03T11:05:00Z" },
];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return [...fallback];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...fallback];
  } catch {
    return [...fallback];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hydrateProducts() {
  const products = read(PRODUCTS_KEY, DEFAULT_PRODUCTS).map(p => ({ ...p, stock: Number(p.stock) || 0, minStock: Number(p.minStock) || 0 }));
  write(PRODUCTS_KEY, products);
  return products;
}

function hydrateMovements() {
  const movements = read(MOVEMENTS_KEY, DEFAULT_MOVEMENTS);
  write(MOVEMENTS_KEY, movements);
  return movements;
}

function productRisk(stock, minStock) {
  if (stock <= 0) return "out";
  if (stock <= minStock) return "low";
  return "ok";
}

function stockDeltaFor(type, quantity) {
  if (type === "in") return quantity;
  if (type === "out") return -quantity;
  return quantity;
}

const inventoryService = {
  listProducts: async () => {
    const products = hydrateProducts();
    return products.map(p => ({
      ...p,
      risk: productRisk(p.stock, p.minStock),
      updatedAt: p.updatedAt || null,
    }));
  },

  getProductById: async (productId) => {
    const products = hydrateProducts();
    return products.find(p => String(p.id) === String(productId)) || null;
  },

  listMovements: async () => {
    const movements = hydrateMovements();
    return [...movements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  adjustStock: async ({
    productId,
    type,
    quantity,
    note = "",
    reference = "",
    user = "Vendedor",
  }) => {
    const qty = Number(quantity) || 0;
    if (!["in", "out", "adjust"].includes(type)) throw new Error("Invalid movement type");
    if (type !== "adjust" && qty <= 0) throw new Error("Quantity must be greater than 0");

    const products = hydrateProducts();
    const idx = products.findIndex(p => String(p.id) === String(productId));
    if (idx < 0) throw new Error("Product not found");

    const beforeStock = Number(products[idx].stock) || 0;
    const rawDelta = stockDeltaFor(type, qty);
    const afterStock = Math.max(0, beforeStock + rawDelta);
    const finalDelta = afterStock - beforeStock;

    products[idx] = {
      ...products[idx],
      stock: afterStock,
      updatedAt: new Date().toISOString(),
    };
    write(PRODUCTS_KEY, products);

    const movements = hydrateMovements();
    const movement = {
      id: Date.now(),
      productId: products[idx].id,
      productName: products[idx].name,
      sku: products[idx].sku,
      type,
      quantity: type === "adjust" ? finalDelta : Math.abs(qty),
      beforeStock,
      afterStock,
      note: String(note || "").trim(),
      reference: String(reference || "").trim(),
      user,
      createdAt: new Date().toISOString(),
    };
    movements.unshift(movement);
    write(MOVEMENTS_KEY, movements);

    return movement;
  },
};

export default inventoryService;
