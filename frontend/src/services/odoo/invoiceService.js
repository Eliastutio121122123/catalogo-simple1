import { api } from "./odooClient";

function normalize(invoice) {
  if (!invoice) return null;
  return {
    ...invoice,
    id: String(invoice.id),
    number: invoice.number || null,
    orderId: invoice.orderId || null,
    customer: invoice.customer || { name: "", email: "", phone: "", address: "" },
    status: invoice.status || "draft",
    paymentStatus: invoice.paymentStatus || "pending",
    paymentMethod: invoice.paymentMethod || "manual",
    issuedAt: invoice.issuedAt || null,
    dueAt: invoice.dueAt || null,
    currency: invoice.currency || "DOP",
    subtotal: Number(invoice.subtotal) || 0,
    tax: Number(invoice.tax) || 0,
    total: Number(invoice.total) || 0,
    paidAmount: Number(invoice.paidAmount) || 0,
    notes: invoice.notes || "",
    lines: Array.isArray(invoice.lines) ? invoice.lines : [],
  };
}

const invoiceService = {
  list: async () => {
    const rows = await api.get("/api/vendor/invoices");
    return Array.isArray(rows) ? rows.map(normalize) : [];
  },

  getById: async (id) => {
    const row = await api.get(`/api/vendor/invoices/${id}`);
    return normalize(row);
  },

  updateStatus: async (id, status) => {
    const row = await api.patch(`/api/vendor/invoices/${id}/status`, { status });
    return normalize(row);
  },

  markAsPaid: async (id, method = "manual") => {
    const row = await api.post(`/api/vendor/invoices/${id}/mark-paid`, { method });
    return normalize(row);
  },
};

export default invoiceService;
