import { useMemo, useState } from "react";

const VENDORS = [
  { id: "VND-049", name: "Nova Style", owner: "Carla M.", email: "ventas@novastyle.com", catalogs: 4, status: "approved", score: 4.8, updatedAt: "2026-03-12T09:02:00" },
  { id: "VND-048", name: "TechStore RD", owner: "Luis A.", email: "contacto@techstore.com", catalogs: 6, status: "approved", score: 4.6, updatedAt: "2026-03-12T08:41:00" },
  { id: "VND-047", name: "Casa Bella", owner: "Jenna P.", email: "hola@casabella.com", catalogs: 3, status: "approved", score: 4.9, updatedAt: "2026-03-12T08:10:00" },
  { id: "VND-046", name: "Happy Toys", owner: "Randy Q.", email: "team@happytoys.com", catalogs: 2, status: "review", score: 4.2, updatedAt: "2026-03-12T07:58:00" },
  { id: "VND-045", name: "GlowLab", owner: "Isabel T.", email: "sales@glowlab.com", catalogs: 5, status: "paused", score: 4.4, updatedAt: "2026-03-11T19:30:00" },
];

const STATUS = ["all", "approved", "review", "paused"];

const statusClass = (s) => {
  if (s === "approved") return "badge ok";
  if (s === "review") return "badge warn";
  return "badge muted";
};

export default function Vendors() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return VENDORS.filter((row) => {
      const text = `${row.name} ${row.owner} ${row.email} ${row.id}`.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchStatus = status === "all" || row.status === status;
      return matchSearch && matchStatus;
    });
  }, [search, status]);

  const stats = useMemo(() => {
    const total = VENDORS.length;
    const approved = VENDORS.filter((v) => v.status === "approved").length;
    const review = VENDORS.filter((v) => v.status === "review").length;
    return { total, approved, review };
  }, []);

  return (
    <>
      <style>{`
        .ven-wrap{display:flex;flex-direction:column;gap:16px}
        .ven-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .ven-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .ven-sub{color:var(--slate-500);font-size:13px}
        .ven-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .ven-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media(max-width:900px){.ven-stats{grid-template-columns:1fr}}
        .stat-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
        .stat-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .stat-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .stat-pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800}
        .stat-pill.ok{background:rgba(16,185,129,.12);color:#0f766e}
        .stat-pill.warn{background:rgba(245,158,11,.12);color:#b45309}

        .ven-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;background:#fff;min-width:220px}
        .search input{border:none;outline:none;background:none;font-size:13px;flex:1;color:var(--slate-700)}
        .sel{border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--slate-700);background:#fff}

        .ven-table{background:#fff;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden}
        .ven-row{display:grid;grid-template-columns:1.2fr 1fr 1fr 0.6fr 0.6fr 0.6fr;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--slate-100)}
        .ven-row.head{background:var(--slate-50);font-size:11px;font-weight:800;color:var(--slate-500);text-transform:uppercase;border-top:none}
        .ven-main{display:flex;flex-direction:column;gap:2px}
        .ven-ttl{font-weight:800;color:var(--slate-900);font-size:13px}
        .ven-subtxt{font-size:12px;color:var(--slate-500)}
        .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:800;border-radius:999px;padding:4px 8px;border:1px solid transparent}
        .badge.ok{background:rgba(34,197,94,.12);color:#15803d}
        .badge.warn{background:rgba(245,158,11,.12);color:#b45309}
        .badge.muted{background:rgba(148,163,184,.2);color:#475569}
        .btn-xs{padding:6px 8px;border-radius:8px;border:1px solid var(--slate-200);background:#fff;font-size:11px;font-weight:800;color:var(--slate-600);cursor:pointer}
        .empty{padding:30px;text-align:center;color:var(--slate-500);font-size:13px}
      `}</style>

      <div className="ven-wrap">
        <div className="ven-head">
          <div>
            <h1 className="ven-title">Vendedores</h1>
            <p className="ven-sub">Administracion de vendedores, estado y aprobaciones.</p>
          </div>
          <div className="ven-actions">
            <button className="btn">Exportar</button>
            <button className="btn primary">Nuevo vendedor</button>
          </div>
        </div>

        <div className="ven-stats">
          <div className="stat-card">
            <div>
              <div className="stat-label">Total vendedores</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <span className="stat-pill ok">Activos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Aprobados</div>
              <div className="stat-value">{stats.approved}</div>
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

        <div className="ven-filters">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar vendedor o email" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s === "all" ? "Estado" : s}</option>)}
          </select>
        </div>

        <div className="ven-table">
          <div className="ven-row head">
            <div>Vendedor</div>
            <div>Propietario</div>
            <div>Email</div>
            <div>Catalogos</div>
            <div>Estado</div>
            <div>Acciones</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">No hay vendedores para los filtros actuales.</div>
          ) : (
            filtered.map((row) => (
              <div key={row.id} className="ven-row">
                <div className="ven-main">
                  <div className="ven-ttl">{row.name}</div>
                  <div className="ven-subtxt">{row.id} · Score {row.score}</div>
                </div>
                <div className="ven-subtxt">{row.owner}</div>
                <div className="ven-subtxt">{row.email}</div>
                <div className="ven-ttl">{row.catalogs}</div>
                <div>
                  <span className={statusClass(row.status)}>{row.status}</span>
                </div>
                <div>
                  <button className="btn-xs">Ver</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
