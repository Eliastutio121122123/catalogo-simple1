import { useMemo, useState } from "react";

const USERS = [
  { id: "USR-102", name: "Gabriel Alcala", email: "gabriel@catalogix.com", role: "Super Admin", status: "active", lastSeen: "2026-03-12T08:22:00" },
  { id: "USR-101", name: "Maria Perez", email: "maria@catalogix.com", role: "Admin", status: "active", lastSeen: "2026-03-12T08:10:00" },
  { id: "USR-100", name: "Luis Brea", email: "luis@catalogix.com", role: "Admin", status: "active", lastSeen: "2026-03-11T19:44:00" },
  { id: "USR-099", name: "Paula Gomez", email: "paula@catalogix.com", role: "Support", status: "inactive", lastSeen: "2026-03-10T11:12:00" },
  { id: "USR-098", name: "Angel Disla", email: "angel@catalogix.com", role: "Auditor", status: "suspended", lastSeen: "2026-03-09T09:05:00" },
];

const ROLES = ["all", "Super Admin", "Admin", "Support", "Auditor"];
const STATUS = ["all", "active", "inactive", "suspended"];

const statusClass = (s) => {
  if (s === "active") return "badge ok";
  if (s === "inactive") return "badge muted";
  return "badge err";
};

export default function Users() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return USERS.filter((row) => {
      const text = `${row.name} ${row.email} ${row.id}`.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchRole = role === "all" || row.role === role;
      const matchStatus = status === "all" || row.status === status;
      return matchSearch && matchRole && matchStatus;
    });
  }, [search, role, status]);

  const stats = useMemo(() => {
    const total = USERS.length;
    const active = USERS.filter((u) => u.status === "active").length;
    const suspended = USERS.filter((u) => u.status === "suspended").length;
    return { total, active, suspended };
  }, []);

  return (
    <>
      <style>{`
        .usr-wrap{display:flex;flex-direction:column;gap:16px}
        .usr-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .usr-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .usr-sub{color:var(--slate-500);font-size:13px}
        .usr-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .usr-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media(max-width:900px){.usr-stats{grid-template-columns:1fr}}
        .stat-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
        .stat-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .stat-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .stat-pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800}
        .stat-pill.ok{background:rgba(16,185,129,.12);color:#0f766e}
        .stat-pill.warn{background:rgba(239,68,68,.12);color:#b91c1c}

        .usr-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;background:#fff;min-width:220px}
        .search input{border:none;outline:none;background:none;font-size:13px;flex:1;color:var(--slate-700)}
        .sel{border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--slate-700);background:#fff}

        .usr-table{background:#fff;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden}
        .usr-row{display:grid;grid-template-columns:1fr 1.2fr 0.9fr 0.6fr 0.6fr;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--slate-100)}
        .usr-row.head{background:var(--slate-50);font-size:11px;font-weight:800;color:var(--slate-500);text-transform:uppercase;border-top:none}
        .usr-main{display:flex;flex-direction:column;gap:2px}
        .usr-ttl{font-weight:800;color:var(--slate-900);font-size:13px}
        .usr-subtxt{font-size:12px;color:var(--slate-500)}
        .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:800;border-radius:999px;padding:4px 8px;border:1px solid transparent}
        .badge.ok{background:rgba(34,197,94,.12);color:#15803d}
        .badge.muted{background:rgba(148,163,184,.2);color:#475569}
        .badge.err{background:rgba(239,68,68,.12);color:#b91c1c}
        .btn-xs{padding:6px 8px;border-radius:8px;border:1px solid var(--slate-200);background:#fff;font-size:11px;font-weight:800;color:var(--slate-600);cursor:pointer}
        .empty{padding:30px;text-align:center;color:var(--slate-500);font-size:13px}
      `}</style>

      <div className="usr-wrap">
        <div className="usr-head">
          <div>
            <h1 className="usr-title">Usuarios</h1>
            <p className="usr-sub">Gestion de usuarios registrados. Lista, busqueda y edicion.</p>
          </div>
          <div className="usr-actions">
            <button className="btn">Importar</button>
            <button className="btn primary">Nuevo usuario</button>
          </div>
        </div>

        <div className="usr-stats">
          <div className="stat-card">
            <div>
              <div className="stat-label">Total usuarios</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <span className="stat-pill ok">Activos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Activos</div>
              <div className="stat-value">{stats.active}</div>
            </div>
            <span className="stat-pill ok">Online</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Suspendidos</div>
              <div className="stat-value">{stats.suspended}</div>
            </div>
            <span className="stat-pill warn">Revisar</span>
          </div>
        </div>

        <div className="usr-filters">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar usuario o correo" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sel" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{r === "all" ? "Rol" : r}</option>)}
          </select>
          <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s === "all" ? "Estado" : s}</option>)}
          </select>
        </div>

        <div className="usr-table">
          <div className="usr-row head">
            <div>Usuario</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Estado</div>
            <div>Acciones</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">No hay usuarios para los filtros actuales.</div>
          ) : (
            filtered.map((row) => (
              <div key={row.id} className="usr-row">
                <div className="usr-main">
                  <div className="usr-ttl">{row.name}</div>
                  <div className="usr-subtxt">{row.id} · Ultimo acceso {new Date(row.lastSeen).toLocaleDateString("es-DO")}</div>
                </div>
                <div className="usr-subtxt">{row.email}</div>
                <div className="usr-ttl">{row.role}</div>
                <div>
                  <span className={statusClass(row.status)}>{row.status}</span>
                </div>
                <div>
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
