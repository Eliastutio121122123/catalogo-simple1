import { useMemo, useState } from "react";

const PAYMENTS = [
  { id: "PAY-9342", order: "SO-20441", customer: "Carla Martinez", method: "Card", amount: 4320, status: "approved", provider: "Stripe", createdAt: "2026-03-12T09:10:22" },
  { id: "PAY-9341", order: "SO-20440", customer: "Luis Alvarez", method: "Card", amount: 12850, status: "pending", provider: "Stripe", createdAt: "2026-03-12T08:55:10" },
  { id: "PAY-9340", order: "SO-20439", customer: "Jenna Perez", method: "Transfer", amount: 2140, status: "approved", provider: "Bank", createdAt: "2026-03-12T08:40:41" },
  { id: "PAY-9339", order: "SO-20438", customer: "Randy Quin", method: "Cash", amount: 1890, status: "review", provider: "Cash", createdAt: "2026-03-12T08:22:02" },
  { id: "PAY-9338", order: "SO-20436", customer: "Mario Delgado", method: "Card", amount: 3920, status: "chargeback", provider: "Stripe", createdAt: "2026-03-12T07:52:11" },
];

const STATUS = ["all", "approved", "pending", "review", "chargeback"];
const METHODS = ["all", "Card", "Transfer", "Cash"];

const statusLabel = (s) => {
  if (s === "approved") return "Aprobado";
  if (s === "pending") return "Pendiente";
  if (s === "review") return "En revision";
  return "Contracargo";
};

const statusClass = (s) => {
  if (s === "approved") return "badge ok";
  if (s === "pending") return "badge warn";
  if (s === "review") return "badge muted";
  return "badge err";
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(n);

export default function Payments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PAYMENTS.filter((row) => {
      const text = `${row.id} ${row.order} ${row.customer} ${row.provider}`.toLowerCase();
      const matchSearch = !q || text.includes(q);
      const matchStatus = status === "all" || row.status === status;
      const matchMethod = method === "all" || row.method === method;
      return matchSearch && matchStatus && matchMethod;
    });
  }, [search, status, method]);

  const stats = useMemo(() => {
    const total = PAYMENTS.length;
    const approved = PAYMENTS.filter((p) => p.status === "approved").length;
    const pending = PAYMENTS.filter((p) => p.status === "pending").length;
    const chargebacks = PAYMENTS.filter((p) => p.status === "chargeback").length;
    return { total, approved, pending, chargebacks };
  }, []);

  return (
    <>
      <style>{`
        .pay-wrap{display:flex;flex-direction:column;gap:16px}
        .pay-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .pay-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .pay-sub{color:var(--slate-500);font-size:13px}
        .pay-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .pay-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:1100px){.pay-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.pay-stats{grid-template-columns:1fr}}
        .stat-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;align-items:center;justify-content:space-between}
        .stat-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .stat-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .stat-pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800}
        .stat-pill.ok{background:rgba(16,185,129,.12);color:#0f766e}
        .stat-pill.warn{background:rgba(245,158,11,.12);color:#b45309}
        .stat-pill.err{background:rgba(239,68,68,.12);color:#b91c1c}
        .stat-pill.muted{background:rgba(148,163,184,.2);color:#475569}

        .pay-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px}
        .search{display:flex;align-items:center;gap:8px;border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;background:#fff;min-width:220px}
        .search input{border:none;outline:none;background:none;font-size:13px;flex:1;color:var(--slate-700)}
        .sel{border:1px solid var(--slate-200);border-radius:10px;padding:8px 10px;font-size:13px;color:var(--slate-700);background:#fff}

        .pay-table{background:#fff;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden}
        .pay-row{display:grid;grid-template-columns:0.8fr 0.8fr 1fr 0.7fr 0.7fr 0.6fr;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--slate-100)}
        .pay-row.head{background:var(--slate-50);font-size:11px;font-weight:800;color:var(--slate-500);text-transform:uppercase;border-top:none}
        .pay-main{display:flex;flex-direction:column;gap:2px}
        .pay-ttl{font-weight:800;color:var(--slate-900);font-size:13px}
        .pay-subtxt{font-size:12px;color:var(--slate-500)}
        .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:800;border-radius:999px;padding:4px 8px;border:1px solid transparent}
        .badge.ok{background:rgba(34,197,94,.12);color:#15803d}
        .badge.warn{background:rgba(245,158,11,.12);color:#b45309}
        .badge.muted{background:rgba(148,163,184,.2);color:#475569}
        .badge.err{background:rgba(239,68,68,.12);color:#b91c1c}
        .btn-xs{padding:6px 8px;border-radius:8px;border:1px solid var(--slate-200);background:#fff;font-size:11px;font-weight:800;color:var(--slate-600);cursor:pointer}
        .empty{padding:30px;text-align:center;color:var(--slate-500);font-size:13px}
      `}</style>

      <div className="pay-wrap">
        <div className="pay-head">
          <div>
            <h1 className="pay-title">Pagos</h1>
            <p className="pay-sub">Reportes de pagos y conciliaciones.</p>
          </div>
          <div className="pay-actions">
            <button className="btn">Conciliar</button>
            <button className="btn primary">Nuevo pago</button>
          </div>
        </div>

        <div className="pay-stats">
          <div className="stat-card">
            <div>
              <div className="stat-label">Pagos totales</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <span className="stat-pill ok">Ok</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Aprobados</div>
              <div className="stat-value">{stats.approved}</div>
            </div>
            <span className="stat-pill ok">Ingresos</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Pendientes</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <span className="stat-pill warn">En cola</span>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Contracargos</div>
              <div className="stat-value">{stats.chargebacks}</div>
            </div>
            <span className="stat-pill err">Revisar</span>
          </div>
        </div>

        <div className="pay-filters">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar pago, orden o cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS.map((s) => <option key={s} value={s}>{s === "all" ? "Estado" : statusLabel(s)}</option>)}
          </select>
          <select className="sel" value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => <option key={m} value={m}>{m === "all" ? "Metodo" : m}</option>)}
          </select>
        </div>

        <div className="pay-table">
          <div className="pay-row head">
            <div>Pago</div>
            <div>Orden</div>
            <div>Cliente</div>
            <div>Monto</div>
            <div>Estado</div>
            <div>Acciones</div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty">No hay pagos para los filtros actuales.</div>
          ) : (
            filtered.map((row) => (
              <div key={row.id} className="pay-row">
                <div className="pay-main">
                  <div className="pay-ttl">{row.id}</div>
                  <div className="pay-subtxt">{row.provider}</div>
                </div>
                <div className="pay-subtxt">{row.order}</div>
                <div className="pay-subtxt">{row.customer}</div>
                <div className="pay-ttl">{fmtMoney(row.amount)}</div>
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
