import { useMemo, useState } from "react";

const CATALOGS = [
  {
    id: "CAT-201",
    name: "Moda Primavera 2026",
    vendor: "Nova Style",
    items: 142,
    status: "published",
    visibility: "public",
    updatedAt: "2026-03-11T18:22:00",
    rating: 4.8,
  },
  {
    id: "CAT-198",
    name: "Tech Essentials",
    vendor: "TechStore RD",
    items: 88,
    status: "review",
    visibility: "public",
    updatedAt: "2026-03-11T15:03:00",
    rating: 4.6,
  },
  {
    id: "CAT-195",
    name: "Hogar & Deco",
    vendor: "Casa Bella",
    items: 210,
    status: "published",
    visibility: "public",
    updatedAt: "2026-03-10T11:15:00",
    rating: 4.9,
  },
  {
    id: "CAT-193",
    name: "Fitness Pro",
    vendor: "Sport Center",
    items: 61,
    status: "paused",
    visibility: "private",
    updatedAt: "2026-03-09T09:44:00",
    rating: 4.4,
  },
  {
    id: "CAT-188",
    name: "Kids & Toys",
    vendor: "Happy Toys",
    items: 75,
    status: "draft",
    visibility: "private",
    updatedAt: "2026-03-08T14:02:00",
    rating: 4.2,
  },
  {
    id: "CAT-183",
    name: "Belleza Premium",
    vendor: "GlowLab",
    items: 54,
    status: "published",
    visibility: "public",
    updatedAt: "2026-03-07T16:28:00",
    rating: 4.7,
  },
];

const STATUSES = ["all", "published", "review", "paused", "draft"];
const VISIBILITY = ["all", "public", "private"];
const SORTS = [
  { id: "updated", label: "Mas reciente" },
  { id: "items", label: "Mas items" },
  { id: "rating", label: "Mejor rating" },
];

const statusClass = (status) => {
  if (status === "published") return "badge ok";
  if (status === "review") return "badge warn";
  if (status === "paused") return "badge muted";
  return "badge draft";
};

const statusLabel = (status) => {
  if (status === "published") return "Publicado";
  if (status === "review") return "En revision";
  if (status === "paused") return "Pausado";
  return "Borrador";
};

export default function Catalogs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = CATALOGS.filter((row) => {
      const text = `${row.name} ${row.vendor} ${row.id}`.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchStatus = status === "all" || row.status === status;
      const matchVis = visibility === "all" || row.visibility === visibility;
      return matchSearch && matchStatus && matchVis;
    });

    rows = rows.sort((a, b) => {
      if (sortBy === "items") return b.items - a.items;
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return rows;
  }, [search, status, visibility, sortBy]);

  const stats = useMemo(() => {
    const total = CATALOGS.length;
    const published = CATALOGS.filter((c) => c.status === "published").length;
    const review = CATALOGS.filter((c) => c.status === "review").length;
    return { total, published, review };
  }, []);

  return (
    <>
      <style>{`
        .cat-wrap{display:flex;flex-direction:column;gap:16px}
        .cat-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .cat-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .cat-sub{color:var(--slate-500);font-size:13px}
        .cat-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .cat-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media(max-width:900px){.cat-stats{grid-template-columns:1fr}}
        .stat-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
        .stat-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .stat-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .stat-pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800}
        .stat-pill.ok{background:rgba(16,185,129,.12);color:#0f766e}
        .stat-pill.warn{background:rgba(245,158,11,.12);color:#b45309}

        .cat-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;background:#fff;min-width:220px}
        .search input{border:none;outline:none;background:none;font-size:13px;flex:1;color:var(--slate-700)}
        .sel{border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--slate-700);background:#fff}

        .cat-table{background:#fff;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden}
        .cat-row{display:grid;grid-template-columns:1.2fr 0.9fr 0.5fr 0.7fr 0.7fr 0.5fr;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--slate-100)}
        .cat-row.head{background:var(--slate-50);font-size:11px;font-weight:800;color:var(--slate-500);text-transform:uppercase;border-top:none}
        .cat-main{display:flex;flex-direction:column;gap:2px}
        .cat-ttl{font-weight:800;color:var(--slate-900);font-size:13px}
        .cat-subtxt{font-size:12px;color:var(--slate-500)}
        .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:800;border-radius:999px;padding:4px 8px;border:1px solid transparent}
        .badge.ok{background:rgba(34,197,94,.12);color:#15803d}
        .badge.warn{background:rgba(245,158,11,.12);color:#b45309}
        .badge.muted{background:rgba(148,163,184,.2);color:#475569}
        .badge.draft{background:rgba(59,130,246,.12);color:#1d4ed8}
        .vis{font-size:12px;font-weight:800;color:var(--slate-600)}
        .actions{display:flex;gap:6px}
        .btn-xs{padding:6px 8px;border-radius:8px;border:1px solid var(--slate-200);background:#fff;font-size:11px;font-weight:800;color:var(--slate-600);cursor:pointer}
        .empty{padding:30px;text-align:center;color:var(--slate-500);font-size:13px}
      `}</style>

      <div className="cat-wrap">
        <div className="cat-head">
          <div>
            <h1 className="cat-title">Catalogos</h1>
            <p className="cat-sub">Gestion de catalogos y estado de publicacion.</p>
          </div>
          <div className="cat-actions">
            <button className="btn">Exportar</button>
            <button className="btn primary">Nuevo catalogo</button>
          </div>
        </div>

        <div className="cat-stats">
          <div className="stat-card">
            <div>
              <div className="stat-label">Total catalogos</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <span className="stat-pill ok">Activos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Publicados</div>
              <div className="stat-value">{stats.published}</div>
            </div>
            <span className="stat-pill ok">Online</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">En revision</div>
              <div className="stat-value">{stats.review}</div>
            </div>
            <span className="stat-pill warn">Pendiente</span>
          </div>
        </div>

        <div className="cat-filters">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar catalogo o vendedor" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "Todos" : statusLabel(s)}</option>)}
          </select>
          <select className="sel" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            {VISIBILITY.map((v) => <option key={v} value={v}>{v === "all" ? "Visibilidad" : v}</option>)}
          </select>
          <select className="sel" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div className="cat-table">
          <div className="cat-row head">
            <div>Catalogo</div>
            <div>Vendedor</div>
            <div>Items</div>
            <div>Estado</div>
            <div>Actualizado</div>
            <div>Acciones</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">No hay catalogos con estos filtros.</div>
          ) : (
            filtered.map((row) => (
              <div key={row.id} className="cat-row">
                <div className="cat-main">
                  <div className="cat-ttl">{row.name}</div>
                  <div className="cat-subtxt">{row.id}</div>
                </div>
                <div className="cat-main">
                  <div className="cat-ttl">{row.vendor}</div>
                  <div className="cat-subtxt">{row.visibility === "public" ? "Publico" : "Privado"}</div>
                </div>
                <div className="cat-ttl">{row.items}</div>
                <div>
                  <span className={statusClass(row.status)}>{statusLabel(row.status)}</span>
                </div>
                <div className="cat-subtxt">{new Date(row.updatedAt).toLocaleDateString("es-DO")}</div>
                <div className="actions">
                  <button className="btn-xs">Ver</button>
                  <button className="btn-xs">Editar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
