import { useMemo, useState } from "react";

const SALES_ROWS = [
  { day: "2026-03-01", orders: 12, revenue: 24500, avgTicket: 2042, conversion: 3.5 },
  { day: "2026-03-02", orders: 15, revenue: 30100, avgTicket: 2006, conversion: 3.8 },
  { day: "2026-03-03", orders: 8, revenue: 16950, avgTicket: 2119, conversion: 2.9 },
  { day: "2026-03-04", orders: 18, revenue: 34900, avgTicket: 1939, conversion: 4.1 },
  { day: "2026-03-05", orders: 11, revenue: 22600, avgTicket: 2055, conversion: 3.2 },
];

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(Number(n || 0));

export default function Reports() {
  const [range, setRange] = useState("7d");

  const data = useMemo(() => {
    if (range === "today") return SALES_ROWS.slice(-1);
    if (range === "30d") return SALES_ROWS;
    return SALES_ROWS.slice(-3);
  }, [range]);

  const kpi = useMemo(() => {
    const orders = data.reduce((acc, r) => acc + r.orders, 0);
    const revenue = data.reduce((acc, r) => acc + r.revenue, 0);
    const avgTicket = orders ? revenue / orders : 0;
    const conversion = data.length ? data.reduce((acc, r) => acc + r.conversion, 0) / data.length : 0;
    return { orders, revenue, avgTicket, conversion };
  }, [data]);

  return (
    <>
      <style>{`
        .vr{display:flex;flex-direction:column;gap:14px}
        .vr-h{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap}
        .vr-title{font-family:'Lexend',sans-serif;font-size:22px;font-weight:800;color:var(--vs-900)}
        .vr-sub{font-size:12.5px;color:var(--vs-500)}
        .vr-in{padding:9px 12px;border-radius:10px;border:1.5px solid var(--vs-200);background:#fff;font-size:13px}
        .vr-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        @media(max-width:1000px){.vr-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.vr-grid{grid-template-columns:1fr}}
        .vr-k{background:#fff;border:1px solid var(--vs-200);border-radius:14px;padding:12px}
        .vr-l{font-size:11px;font-weight:800;color:var(--vs-500);text-transform:uppercase}
        .vr-v{font-family:'Lexend',sans-serif;font-size:24px;font-weight:800;color:var(--vs-900);margin-top:6px}
        .vr-tb{background:#fff;border:1px solid var(--vs-200);border-radius:16px;overflow:hidden}
        .vr-th,.vr-tr{display:grid;grid-template-columns:1fr .8fr 1fr 1fr .8fr;gap:10px;align-items:center;padding:11px 14px}
        .vr-th{background:var(--vs-50);font-size:11px;font-weight:800;color:var(--vs-500);text-transform:uppercase}
        .vr-tr{border-top:1px solid var(--vs-100);font-size:13px;color:var(--vs-700)}
      `}</style>

      <div className="vr">
        <div className="vr-h">
          <div>
            <h1 className="vr-title">Reports</h1>
            <p className="vr-sub">Resumen de rendimiento comercial del vendedor.</p>
          </div>
          <select className="vr-in" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="today">Hoy</option>
            <option value="7d">Ultimos 7 dias</option>
            <option value="30d">Ultimos 30 dias</option>
          </select>
        </div>

        <div className="vr-grid">
          <article className="vr-k">
            <div className="vr-l">Ingresos</div>
            <div className="vr-v">{fmtMoney(kpi.revenue)}</div>
          </article>
          <article className="vr-k">
            <div className="vr-l">Pedidos</div>
            <div className="vr-v">{kpi.orders}</div>
          </article>
          <article className="vr-k">
            <div className="vr-l">Ticket promedio</div>
            <div className="vr-v">{fmtMoney(kpi.avgTicket)}</div>
          </article>
          <article className="vr-k">
            <div className="vr-l">Conversion</div>
            <div className="vr-v">{kpi.conversion.toFixed(1)}%</div>
          </article>
        </div>

        <div className="vr-tb">
          <div className="vr-th">
            <span>Fecha</span>
            <span>Pedidos</span>
            <span>Ingresos</span>
            <span>Ticket prom.</span>
            <span>Conv.</span>
          </div>
          {data.map((r) => (
            <div className="vr-tr" key={r.day}>
              <span>{new Date(`${r.day}T00:00:00`).toLocaleDateString("es-DO")}</span>
              <span>{r.orders}</span>
              <span>{fmtMoney(r.revenue)}</span>
              <span>{fmtMoney(r.avgTicket)}</span>
              <span>{r.conversion}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
