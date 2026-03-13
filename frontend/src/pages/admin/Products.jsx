import { useMemo, useState } from "react";

const PRODUCTS = [
  { id: "PRD-901", name: "MacBook Pro M3", sku: "MBP-M3", catalog: "Tech Essentials", vendor: "TechStore RD", price: 85000, stock: 5, status: "active", updatedAt: "2026-03-12T09:01:00" },
  { id: "PRD-900", name: "iPhone 15 Pro Max", sku: "IPH-15PM", catalog: "Tech Essentials", vendor: "TechStore RD", price: 72000, stock: 12, status: "active", updatedAt: "2026-03-12T08:46:00" },
  { id: "PRD-899", name: "Vestido Elegante Rojo", sku: "VE-RED", catalog: "Moda Primavera 2026", vendor: "Nova Style", price: 3500, stock: 8, status: "active", updatedAt: "2026-03-12T08:28:00" },
  { id: "PRD-898", name: "Sofa Modular", sku: "SOF-MOD", catalog: "Hogar & Deco", vendor: "Casa Bella", price: 28000, stock: 3, status: "low", updatedAt: "2026-03-12T08:10:00" },
  { id: "PRD-897", name: "Mancuernas Ajustables", sku: "FIT-ADJ", catalog: "Fitness Pro", vendor: "Sport Center", price: 4200, stock: 20, status: "active", updatedAt: "2026-03-12T07:55:00" },
  { id: "PRD-896", name: "Auriculares XM5", sku: "SONY-XM5", catalog: "Tech Essentials", vendor: "TechStore RD", price: 18000, stock: 7, status: "active", updatedAt: "2026-03-11T19:45:00" },
  { id: "PRD-895", name: "Cochecito Infantil", sku: "KID-CAR", catalog: "Kids & Toys", vendor: "Happy Toys", price: 6400, stock: 0, status: "out", updatedAt: "2026-03-11T18:30:00" },
];

const STATUS = ["all", "active", "low", "out"];

const statusLabel = (s) => {
  if (s === "active") return "Activo";
  if (s === "low") return "Bajo stock";
  return "Agotado";
};

const statusClass = (s) => {
  if (s === "active") return "badge ok";
  if (s === "low") return "badge warn";
  return "badge err";
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(n);

export default function Products() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter((row) => {
      const text = `${row.name} ${row.sku} ${row.catalog} ${row.vendor}`.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchStatus = status === "all" || row.status === status;
      return matchSearch && matchStatus;
    });
  }, [search, status]);

  const stats = useMemo(() => {
    const total = PRODUCTS.length;
    const active = PRODUCTS.filter((p) => p.status === "active").length;
    const low = PRODUCTS.filter((p) => p.status === "low").length;
    const out = PRODUCTS.filter((p) => p.status === "out").length;
    return { total, active, low, out };
  }, []);

  return (
    <>
      <style>{`
        .prd-wrap{display:flex;flex-direction:column;gap:16px}
        .prd-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .prd-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .prd-sub{color:var(--slate-500);font-size:13px}
        .prd-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .prd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:1100px){.prd-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.prd-stats{grid-template-columns:1fr}}
        .stat-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
        .stat-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .stat-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .stat-pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800}
        .stat-pill.ok{background:rgba(16,185,129,.12);color:#0f766e}
        .stat-pill.warn{background:rgba(245,158,11,.12);color:#b45309}
        .stat-pill.err{background:rgba(239,68,68,.12);color:#b91c1c}

        .prd-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;background:#fff;min-width:220px}
        .search input{border:none;outline:none;background:none;font-size:13px;flex:1;color:var(--slate-700)}
        .sel{border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--slate-700);background:#fff}

        .prd-table{background:#fff;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden}
        .prd-row{display:grid;grid-template-columns:1.1fr 0.9fr 0.9fr 0.7fr 0.6fr 0.6fr;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--slate-100)}
        .prd-row.head{background:var(--slate-50);font-size:11px;font-weight:800;color:var(--slate-500);text-transform:uppercase;border-top:none}
        .prd-main{display:flex;flex-direction:column;gap:2px}
        .prd-ttl{font-weight:800;color:var(--slate-900);font-size:13px}
        .prd-subtxt{font-size:12px;color:var(--slate-500)}
        .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:800;border-radius:999px;padding:4px 8px;border:1px solid transparent}
        .badge.ok{background:rgba(34,197,94,.12);color:#15803d}
        .badge.warn{background:rgba(245,158,11,.12);color:#b45309}
        .badge.err{background:rgba(239,68,68,.12);color:#b91c1c}
        .btn-xs{padding:6px 8px;border-radius:8px;border:1px solid var(--slate-200);background:#fff;font-size:11px;font-weight:800;color:var(--slate-600);cursor:pointer}
        .empty{padding:30px;text-align:center;color:var(--slate-500);font-size:13px}
      `}</style>

      <div className="prd-wrap">
        <div className="prd-head">
          <div>
            <h1 className="prd-title">Productos</h1>
            <p className="prd-sub">Gestion de productos, precios y disponibilidad.</p>
          </div>
          <div className="prd-actions">
            <button className="btn">Exportar</button>
            <button className="btn primary">Nuevo producto</button>
          </div>
        </div>

        <div className="prd-stats">
          <div className="stat-card">
            <div>
              <div className="stat-label">Total productos</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <span className="stat-pill ok">Activos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">En stock</div>
              <div className="stat-value">{stats.active}</div>
            </div>
            <span className="stat-pill ok">Listos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Bajo stock</div>
              <div className="stat-value">{stats.low}</div>
            </div>
            <span className="stat-pill warn">Revisar</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Agotados</div>
              <div className="stat-value">{stats.out}</div>
            </div>
            <span className="stat-pill err">Urgente</span>
          </div>
        </div>

        <div className="prd-filters">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar producto, SKU o catalogo" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s === "all" ? "Estado" : statusLabel(s)}</option>)}
          </select>
        </div>

        <div className="prd-table">
          <div className="prd-row head">
            <div>Producto</div>
            <div>Catalogo</div>
            <div>Vendedor</div>
            <div>Precio</div>
            <div>Stock</div>
            <div>Estado</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">No hay productos para los filtros actuales.</div>
          ) : (
            filtered.map((row) => (
              <div key={row.id} className="prd-row">
                <div className="prd-main">
                  <div className="prd-ttl">{row.name}</div>
                  <div className="prd-subtxt">{row.sku} · {row.id}</div>
                </div>
                <div className="prd-subtxt">{row.catalog}</div>
                <div className="prd-subtxt">{row.vendor}</div>
                <div className="prd-ttl">{fmtMoney(row.price)}</div>
                <div className="prd-ttl">{row.stock}</div>
                <div>
                  <span className={statusClass(row.status)}>{statusLabel(row.status)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
