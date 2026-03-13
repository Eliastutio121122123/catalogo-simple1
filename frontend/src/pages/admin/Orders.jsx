import { useMemo, useState } from "react";

const ORDERS = [
  { id: "SO-20441", customer: "Carla Martinez", vendor: "Nova Style", total: 4320, status: "paid", channel: "web", updatedAt: "2026-03-12T09:10:22" },
  { id: "SO-20440", customer: "Luis Alvarez", vendor: "TechStore RD", total: 12850, status: "processing", channel: "web", updatedAt: "2026-03-12T08:55:10" },
  { id: "SO-20439", customer: "Jenna Perez", vendor: "Casa Bella", total: 2140, status: "shipped", channel: "mobile", updatedAt: "2026-03-12T08:40:41" },
  { id: "SO-20438", customer: "Randy Quin", vendor: "Happy Toys", total: 1890, status: "review", channel: "web", updatedAt: "2026-03-12T08:22:02" },
  { id: "SO-20437", customer: "Isabel Torres", vendor: "GlowLab", total: 7040, status: "paid", channel: "mobile", updatedAt: "2026-03-12T08:11:46" },
  { id: "SO-20436", customer: "Mario Delgado", vendor: "Sport Center", total: 3920, status: "cancelled", channel: "web", updatedAt: "2026-03-12T07:52:11" },
];

const STATUS = ["all", "paid", "processing", "shipped", "review", "cancelled"];
const CHANNELS = ["all", "web", "mobile"];

const statusLabel = (s) => {
  if (s === "paid") return "Pagado";
  if (s === "processing") return "Procesando";
  if (s === "shipped") return "Enviado";
  if (s === "review") return "En revision";
  return "Cancelado";
};

const statusClass = (s) => {
  if (s === "paid") return "badge ok";
  if (s === "processing") return "badge warn";
  if (s === "shipped") return "badge info";
  if (s === "review") return "badge muted";
  return "badge err";
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(n);

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((row) => {
      const text = `${row.id} ${row.customer} ${row.vendor}`.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchStatus = status === "all" || row.status === status;
      const matchChannel = channel === "all" || row.channel === channel;
      return matchSearch && matchStatus && matchChannel;
    });
  }, [search, status, channel]);

  const stats = useMemo(() => {
    const total = ORDERS.length;
    const processing = ORDERS.filter((o) => o.status === "processing").length;
    const shipped = ORDERS.filter((o) => o.status === "shipped").length;
    const cancelled = ORDERS.filter((o) => o.status === "cancelled").length;
    return { total, processing, shipped, cancelled };
  }, []);

  return (
    <>
      <style>{`
        .ord-wrap{display:flex;flex-direction:column;gap:16px}
        .ord-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .ord-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .ord-sub{color:var(--slate-500);font-size:13px}
        .ord-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .ord-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:1100px){.ord-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.ord-stats{grid-template-columns:1fr}}
        .stat-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
        .stat-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .stat-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .stat-pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800}
        .stat-pill.ok{background:rgba(16,185,129,.12);color:#0f766e}
        .stat-pill.warn{background:rgba(245,158,11,.12);color:#b45309}
        .stat-pill.muted{background:rgba(148,163,184,.2);color:#475569}
        .stat-pill.err{background:rgba(239,68,68,.12);color:#b91c1c}

        .ord-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;background:#fff;min-width:220px}
        .search input{border:none;outline:none;background:none;font-size:13px;flex:1;color:var(--slate-700)}
        .sel{border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--slate-700);background:#fff}

        .ord-table{background:#fff;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden}
        .ord-row{display:grid;grid-template-columns:0.9fr 1.2fr 1fr 0.7fr 0.7fr 0.6fr;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--slate-100)}
        .ord-row.head{background:var(--slate-50);font-size:11px;font-weight:800;color:var(--slate-500);text-transform:uppercase;border-top:none}
        .ord-main{display:flex;flex-direction:column;gap:2px}
        .ord-ttl{font-weight:800;color:var(--slate-900);font-size:13px}
        .ord-subtxt{font-size:12px;color:var(--slate-500)}
        .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:800;border-radius:999px;padding:4px 8px;border:1px solid transparent}
        .badge.ok{background:rgba(34,197,94,.12);color:#15803d}
        .badge.warn{background:rgba(245,158,11,.12);color:#b45309}
        .badge.info{background:rgba(14,165,233,.12);color:#0369a1}
        .badge.muted{background:rgba(148,163,184,.2);color:#475569}
        .badge.err{background:rgba(239,68,68,.12);color:#b91c1c}
        .btn-xs{padding:6px 8px;border-radius:8px;border:1px solid var(--slate-200);background:#fff;font-size:11px;font-weight:800;color:var(--slate-600);cursor:pointer}
        .empty{padding:30px;text-align:center;color:var(--slate-500);font-size:13px}
      `}</style>

      <div className="ord-wrap">
        <div className="ord-head">
          <div>
            <h1 className="ord-title">Pedidos</h1>
            <p className="ord-sub">Control de pedidos y su estado.</p>
          </div>
          <div className="ord-actions">
            <button className="btn">Exportar</button>
            <button className="btn primary">Nuevo pedido</button>
          </div>
        </div>

        <div className="ord-stats">
          <div className="stat-card">
            <div>
              <div className="stat-label">Total pedidos</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <span className="stat-pill ok">Activos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Procesando</div>
              <div className="stat-value">{stats.processing}</div>
            </div>
            <span className="stat-pill warn">En cola</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Enviados</div>
              <div className="stat-value">{stats.shipped}</div>
            </div>
            <span className="stat-pill ok">On route</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Cancelados</div>
              <div className="stat-value">{stats.cancelled}</div>
            </div>
            <span className="stat-pill err">Atencion</span>
          </div>
        </div>

        <div className="ord-filters">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar pedido, cliente o vendedor" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s === "all" ? "Estado" : statusLabel(s)}</option>)}
          </select>
          <select className="sel" value={channel} onChange={(e) => setChannel(e.target.value)}>
            {CHANNELS.map((c) => <option key={c} value={c}>{c === "all" ? "Canal" : c}</option>)}
          </select>
        </div>

        <div className="ord-table">
          <div className="ord-row head">
            <div>Orden</div>
            <div>Cliente</div>
            <div>Vendedor</div>
            <div>Total</div>
            <div>Estado</div>
            <div>Acciones</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">No hay pedidos para los filtros actuales.</div>
          ) : (
            filtered.map((row) => (
              <div key={row.id} className="ord-row">
                <div className="ord-main">
                  <div className="ord-ttl">{row.id}</div>
                  <div className="ord-subtxt">{new Date(row.updatedAt).toLocaleDateString("es-DO")}</div>
                </div>
                <div className="ord-main">
                  <div className="ord-ttl">{row.customer}</div>
                  <div className="ord-subtxt">{row.channel}</div>
                </div>
                <div className="ord-subtxt">{row.vendor}</div>
                <div className="ord-ttl">{fmtMoney(row.total)}</div>
                <div>
                  <span className={statusClass(row.status)}>{statusLabel(row.status)}</span>
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
