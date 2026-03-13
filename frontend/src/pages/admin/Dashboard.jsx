import { useMemo, useState } from "react";

const KPI = [
  { id: "gmv", label: "GMV mensual", value: "RD$ 2.4M", delta: "+12.4%", trend: "up" },
  { id: "orders", label: "Pedidos", value: "3,842", delta: "+8.1%", trend: "up" },
  { id: "vendors", label: "Vendedores activos", value: "214", delta: "+3.7%", trend: "up" },
  { id: "issues", label: "Alertas abiertas", value: "19", delta: "-4", trend: "down" },
];

const SALES = [
  { day: "Lun", value: 62 },
  { day: "Mar", value: 88 },
  { day: "Mie", value: 74 },
  { day: "Jue", value: 96 },
  { day: "Vie", value: 120 },
  { day: "Sab", value: 82 },
  { day: "Dom", value: 64 },
];

const TOP_CATEGORIES = [
  { name: "Tecnologia", value: 32, color: "#2563eb" },
  { name: "Moda", value: 24, color: "#06b6d4" },
  { name: "Hogar", value: 18, color: "#22c55e" },
  { name: "Deportes", value: 14, color: "#f59e0b" },
  { name: "Belleza", value: 12, color: "#a855f7" },
];

const RECENT_ORDERS = [
  { id: "SO-20441", vendor: "Nova Style", customer: "Carla M.", total: "RD$ 4,320", status: "paid" },
  { id: "SO-20440", vendor: "TechStore RD", customer: "Luis A.", total: "RD$ 12,850", status: "processing" },
  { id: "SO-20439", vendor: "Casa Bella", customer: "Jenna P.", total: "RD$ 2,140", status: "shipped" },
  { id: "SO-20438", vendor: "Happy Toys", customer: "Randy Q.", total: "RD$ 1,890", status: "review" },
  { id: "SO-20437", vendor: "GlowLab", customer: "Isabel T.", total: "RD$ 7,040", status: "paid" },
];

const ALERTS = [
  { id: "AL-17", label: "Pago duplicado detectado", type: "critical", time: "hace 12 min" },
  { id: "AL-16", label: "Catalogo con baja conversion", type: "warning", time: "hace 40 min" },
  { id: "AL-15", label: "Nuevo vendedor pendiente", type: "info", time: "hace 1h" },
];

const STATUS = {
  paid: "Pagado",
  processing: "Procesando",
  shipped: "Enviado",
  review: "En revision",
};

const statusClass = (status) => {
  if (status === "paid") return "pill ok";
  if (status === "processing") return "pill warn";
  if (status === "shipped") return "pill info";
  return "pill muted";
};

export default function Dashboard() {
  const [range, setRange] = useState("7d");
  const maxSales = useMemo(() => Math.max(...SALES.map((s) => s.value), 1), []);

  return (
    <>
      <style>{`
        .dash-wrap{display:flex;flex-direction:column;gap:16px}
        .dash-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
        .dash-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--slate-900)}
        .dash-sub{color:var(--slate-500);font-size:13px}
        .dash-actions{display:flex;gap:8px;flex-wrap:wrap}
        .btn{border:1px solid var(--slate-200);background:#fff;color:var(--slate-700);padding:9px 12px;border-radius:10px;font-weight:700;font-size:12.5px;cursor:pointer}
        .btn.primary{border:none;background:linear-gradient(135deg,var(--blue-600),var(--teal-500));color:#fff}

        .range{display:flex;gap:6px;align-items:center}
        .chip{padding:6px 10px;border-radius:999px;border:1px solid var(--slate-200);font-size:11px;font-weight:800;color:var(--slate-600);background:#fff;cursor:pointer}
        .chip.active{background:var(--blue-50);border-color:var(--blue-100);color:var(--blue-700)}

        .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:1100px){.kpi-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.kpi-grid{grid-template-columns:1fr}}
        .kpi-card{background:#fff;border:1px solid var(--slate-200);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}
        .kpi-label{font-size:11px;text-transform:uppercase;color:var(--slate-500);font-weight:800}
        .kpi-value{font-family:'Lexend',sans-serif;font-size:20px;font-weight:800;color:var(--slate-900)}
        .kpi-delta{font-size:11px;font-weight:800;padding:4px 8px;border-radius:999px;align-self:flex-start}
        .kpi-delta.up{background:rgba(34,197,94,.12);color:#15803d}
        .kpi-delta.down{background:rgba(239,68,68,.12);color:#b91c1c}

        .dash-grid{display:grid;grid-template-columns:2fr 1fr;gap:12px}
        @media(max-width:1100px){.dash-grid{grid-template-columns:1fr}}

        .card{background:#fff;border:1px solid var(--slate-200);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px}
        .card-head{display:flex;align-items:center;justify-content:space-between}
        .card-title{font-size:14px;font-weight:800;color:var(--slate-900)}
        .card-sub{font-size:12px;color:var(--slate-500)}

        .chart{height:220px;display:flex;align-items:flex-end;gap:10px;padding:12px;border-radius:14px;background:linear-gradient(180deg,rgba(59,130,246,.08),transparent)}
        .bar{flex:1;display:flex;flex-direction:column;gap:6px;align-items:center}
        .bar-fill{width:100%;border-radius:10px;background:linear-gradient(180deg,#2563eb,#22d3ee)}
        .bar-label{font-size:11px;color:var(--slate-500);font-weight:700}

        .cats{display:flex;flex-direction:column;gap:10px}
        .cat-row{display:flex;align-items:center;gap:10px}
        .cat-dot{width:10px;height:10px;border-radius:50%}
        .cat-name{font-size:12px;font-weight:700;color:var(--slate-700)}
        .cat-bar{flex:1;height:8px;border-radius:999px;background:var(--slate-100);overflow:hidden}
        .cat-bar span{display:block;height:100%}
        .cat-value{font-size:12px;font-weight:800;color:var(--slate-900)}

        .orders{display:flex;flex-direction:column;gap:10px}
        .order-row{display:grid;grid-template-columns:0.9fr 1fr 1fr 0.7fr 0.7fr;gap:10px;align-items:center;padding:10px 12px;border:1px solid var(--slate-100);border-radius:12px}
        .order-row.head{background:var(--slate-50);border:none;font-size:11px;font-weight:800;text-transform:uppercase;color:var(--slate-500)}
        .order-ttl{font-size:12.5px;font-weight:800;color:var(--slate-900)}
        .order-sub{font-size:12px;color:var(--slate-500)}
        .pill{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800;display:inline-flex}
        .pill.ok{background:rgba(34,197,94,.12);color:#15803d}
        .pill.warn{background:rgba(245,158,11,.12);color:#b45309}
        .pill.info{background:rgba(14,165,233,.12);color:#0369a1}
        .pill.muted{background:rgba(148,163,184,.2);color:#475569}

        .alerts{display:flex;flex-direction:column;gap:10px}
        .alert{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--slate-100);border-radius:12px}
        .alert-dot{width:10px;height:10px;border-radius:50%}
        .alert-title{font-size:12.5px;font-weight:800;color:var(--slate-900)}
        .alert-sub{font-size:12px;color:var(--slate-500)}
        .alert-tag{font-size:11px;font-weight:800;padding:4px 8px;border-radius:999px}
        .alert-tag.critical{background:rgba(239,68,68,.12);color:#b91c1c}
        .alert-tag.warning{background:rgba(245,158,11,.12);color:#b45309}
        .alert-tag.info{background:rgba(14,165,233,.12);color:#0369a1}
      `}</style>

      <div className="dash-wrap">
        <div className="dash-head">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-sub">Resumen general del negocio y operaciones.</p>
          </div>
          <div className="dash-actions">
            <div className="range">
              {["24h", "7d", "30d"].map((r) => (
                <button key={r} className={`chip${range === r ? " active" : ""}`} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
            <button className="btn">Exportar</button>
            <button className="btn primary">Nueva accion</button>
          </div>
        </div>

        <div className="kpi-grid">
          {KPI.map((k) => (
            <div key={k.id} className="kpi-card">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <span className={`kpi-delta ${k.trend}`}>{k.delta}</span>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Ventas semanales</div>
                <div className="card-sub">Comparado con la semana anterior</div>
              </div>
              <div className="order-sub">Base: RD$</div>
            </div>
            <div className="chart">
              {SALES.map((row) => (
                <div key={row.day} className="bar">
                  <div className="bar-fill" style={{ height: `${Math.round((row.value / maxSales) * 100)}%` }} />
                  <span className="bar-label">{row.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Categorias lideres</div>
                <div className="card-sub">Participacion por ventas</div>
              </div>
            </div>
            <div className="cats">
              {TOP_CATEGORIES.map((row) => (
                <div key={row.name} className="cat-row">
                  <span className="cat-dot" style={{ background: row.color }} />
                  <div className="cat-name">{row.name}</div>
                  <div className="cat-bar"><span style={{ width: `${row.value}%`, background: row.color }} /></div>
                  <div className="cat-value">{row.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-grid">
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Pedidos recientes</div>
                <div className="card-sub">Ultimas ordenes procesadas</div>
              </div>
              <button className="btn">Ver pedidos</button>
            </div>
            <div className="orders">
              <div className="order-row head">
                <div>Orden</div>
                <div>Vendedor</div>
                <div>Cliente</div>
                <div>Total</div>
                <div>Estado</div>
              </div>
              {RECENT_ORDERS.map((row) => (
                <div key={row.id} className="order-row">
                  <div className="order-ttl">{row.id}</div>
                  <div className="order-sub">{row.vendor}</div>
                  <div className="order-sub">{row.customer}</div>
                  <div className="order-ttl">{row.total}</div>
                  <div><span className={statusClass(row.status)}>{STATUS[row.status]}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Alertas activas</div>
                <div className="card-sub">Requieren atencion</div>
              </div>
              <button className="btn">Ver auditoria</button>
            </div>
            <div className="alerts">
              {ALERTS.map((row) => (
                <div key={row.id} className="alert">
                  <span className="alert-dot" style={{ background: row.type === "critical" ? "#ef4444" : row.type === "warning" ? "#f59e0b" : "#0ea5e9" }} />
                  <div>
                    <div className="alert-title">{row.label}</div>
                    <div className="alert-sub">{row.time}</div>
                  </div>
                  <span className={`alert-tag ${row.type}`}>{row.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
