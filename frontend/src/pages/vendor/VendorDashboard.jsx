import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const IcoTrendUp   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IcoTrendDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;
const IcoArrow     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoPlus      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoDollar    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IcoOrders    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IcoEye       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcoStar      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoAlert     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoCheck     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoClock     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoTruck     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcoX         = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoXSm       = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoRefresh   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IcoPackage   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcoCatalogs  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IcoBarChart  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoInventory = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
const IcoTag       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

// ─── Datos mock ───────────────────────────────────────────────────────────────
const STATS = [
  { id:"ventas",  label:"Ventas del mes",      value:"RD$84,200", prev:"RD$75,100", change:+12.1, sub:"este mes",        icon:IcoDollar,  clr:"teal"   },
  { id:"pedidos", label:"Pedidos totales",      value:"34",        prev:"29",        change:+17.2, sub:"8 pendientes",    icon:IcoOrders,  clr:"blue"   },
  { id:"visitas", label:"Visitas al catálogo",  value:"1,248",     prev:"1,406",     change:-11.5, sub:"últimos 30 días", icon:IcoEye,     clr:"violet" },
  { id:"rating",  label:"Valoración media",     value:"4.8 ★",     prev:"4.7 ★",     change:+4.3,  sub:"124 reseñas",    icon:IcoStar,    clr:"amber"  },
];

const RECENT_ORDERS = [
  { id:"#1042", customer:"María González",   product:"Vestido Floral",     amount:"RD$2,850", status:"pending",   time:"hace 3 min"  },
  { id:"#1041", customer:"Carlos Martínez",  product:"Blazer Oversize",    amount:"RD$3,200", status:"shipped",   time:"hace 28 min" },
  { id:"#1040", customer:"Ana Rodríguez",    product:"Jeans Slim x2",      amount:"RD$3,900", status:"delivered", time:"hace 1h"     },
  { id:"#1039", customer:"Luis Pérez",       product:"Set Yoga Premium",   amount:"RD$3,400", status:"pending",   time:"hace 2h"     },
  { id:"#1038", customer:"Sofia Herrera",    product:"Sérum Vitamina C",   amount:"RD$1,850", status:"cancelled", time:"hace 3h"     },
  { id:"#1037", customer:"Jorge Díaz",       product:"Tenis Nike Air",     amount:"RD$6,500", status:"delivered", time:"ayer"        },
];

const TOP_PRODUCTS = [
  { id:1, name:"Vestido Floral Verano",  catalog:"Nova Style",      sold:128, revenue:"RD$36,480", stock:8,  clr:"#f43f5e" },
  { id:2, name:"Blazer Oversize Gris",   catalog:"Nova Style",      sold:89,  revenue:"RD$28,480", stock:14, clr:"#64748b" },
  { id:3, name:"Tenis Running Nike Air", catalog:"FitLife Store",   sold:67,  revenue:"RD$43,550", stock:3,  clr:"#f97316" },
  { id:4, name:"Sérum Vitamina C",       catalog:"Glam Beauty Box", sold:55,  revenue:"RD$10,175", stock:22, clr:"#ec4899" },
  { id:5, name:"Jeans Slim Azul",        catalog:"Nova Style",      sold:48,  revenue:"RD$9,360",  stock:0,  clr:"#1d4ed8" },
];

const ALERTS = [
  { id:1, sev:"red",   msg:"Jeans Slim Azul — sin stock disponible",         action:"Reponer",   path:"/vendor/inventory" },
  { id:2, sev:"amber", msg:"Tenis Nike Air — solo quedan 3 unidades",        action:"Reponer",   path:"/vendor/inventory" },
  { id:3, sev:"amber", msg:"Pedido #1039 sin confirmar hace más de 2 horas", action:"Revisar",   path:"/vendor/orders"    },
  { id:4, sev:"red",   msg:"Nueva reseña de 1★ en Vestido Floral Verano",    action:"Responder", path:"/vendor/products"  },
];

const CHART_DATA = [
  { day:"L", val:62 }, { day:"M", val:85 }, { day:"X", val:54 },
  { day:"J", val:91 }, { day:"V", val:100 }, { day:"S", val:78 }, { day:"D", val:43 },
];

const STATUS_MAP = {
  pending:   { label:"Pendiente",  color:"#d97706", bg:"#fef9ec", Ico: IcoClock },
  shipped:   { label:"Enviado",    color:"#2563eb", bg:"#eff6ff", Ico: IcoTruck },
  delivered: { label:"Entregado",  color:"#16a34a", bg:"#f0fdf4", Ico: IcoCheck },
  cancelled: { label:"Cancelado",  color:"#ef4444", bg:"#fef2f2", Ico: IcoXSm   },
};

const QUICK_ACTIONS = [
  { lbl:"Agregar producto",      path:"/vendor/products/new", I:IcoPackage,   bg:"rgba(6,182,212,.1)",   c:"#0891b2" },
  { lbl:"Crear catálogo",        path:"/vendor/catalogs/new", I:IcoCatalogs,  bg:"rgba(37,99,235,.1)",   c:"#2563eb" },
  { lbl:"Ver pedidos nuevos",    path:"/vendor/orders",       I:IcoOrders,    bg:"rgba(245,158,11,.1)",  c:"#d97706" },
  { lbl:"Actualizar inventario", path:"/vendor/inventory",    I:IcoInventory, bg:"rgba(34,197,94,.1)",   c:"#16a34a" },
  { lbl:"Crear promoción",       path:"/vendor/promotions",   I:IcoTag,       bg:"rgba(239,68,68,.08)",  c:"#ef4444" },
  { lbl:"Ver reportes",          path:"/vendor/reports",      I:IcoBarChart,  bg:"rgba(124,58,237,.1)",  c:"#7c3aed" },
];

// ─── Colores por tipo ─────────────────────────────────────────────────────────
const CLR = {
  teal:   { bg:"rgba(6,182,212,.09)",  br:"rgba(6,182,212,.22)",  ib:"rgba(6,182,212,.14)",  ic:"var(--vt-600)"  },
  blue:   { bg:"rgba(37,99,235,.07)",  br:"rgba(37,99,235,.2)",   ib:"rgba(37,99,235,.12)",  ic:"var(--vb-600)"  },
  violet: { bg:"rgba(124,58,237,.07)", br:"rgba(124,58,237,.2)",  ib:"rgba(124,58,237,.12)", ic:"#7c3aed"        },
  amber:  { bg:"rgba(245,158,11,.07)", br:"rgba(245,158,11,.2)",  ib:"rgba(245,158,11,.12)", ic:"#d97706"        },
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function StatCard({ s, idx }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80 + idx * 70); return () => clearTimeout(t); }, []);
  const up = s.change >= 0;
  const c  = CLR[s.clr];
  return (
    <div className="vd-stat" style={{
      background: c.bg, border: `1.5px solid ${c.br}`,
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(10px)",
      transition: `opacity .4s ease ${idx * 65}ms, transform .4s ease ${idx * 65}ms`,
    }}>
      <div className="vd-stat-top">
        <div className="vd-stat-ico" style={{ background: c.ib, color: c.ic }}><s.icon /></div>
        <div className={`vd-stat-badge ${up ? "up" : "dn"}`}>
          {up ? <IcoTrendUp /> : <IcoTrendDown />}{Math.abs(s.change)}%
        </div>
      </div>
      <div className="vd-stat-val">{s.value}</div>
      <div className="vd-stat-lbl">{s.label}</div>
      <div className="vd-stat-sub">{s.sub}</div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VendorDashboard() {
  const navigate = useNavigate();
  const [ready,   setReady  ] = useState(false);
  const [alerts,  setAlerts ] = useState(ALERTS);
  const [period,  setPeriod ] = useState("mes");
  const [spin,    setSpin   ] = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 50); }, []);

  const maxBar = Math.max(...CHART_DATA.map(d => d.val));

  const doRefresh = () => {
    setSpin(true);
    setTimeout(() => setSpin(false), 800);
  };

  const dismissAlert = (id) => setAlerts(v => v.filter(a => a.id !== id));

  const today = new Date().toLocaleDateString("es-DO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{`
        /* ─ Variables heredadas de VendorLayout ya están en :root ─ */

        .vd { opacity:0; transform:translateY(6px); transition:opacity .35s ease, transform .35s ease; }
        .vd.in { opacity:1; transform:translateY(0); }

        /* ── Hero ── */
        .vd-hero { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; flex-wrap:wrap; margin-bottom:22px; }
        .vd-gdot { width:6px; height:6px; border-radius:50%; background:var(--vt-500); display:inline-block; margin-right:7px; animation:vdblink 2.4s ease-in-out infinite; }
        @keyframes vdblink { 0%,100%{opacity:1} 50%{opacity:.18} }
        .vd-eyebrow { font-size:11px; font-weight:700; color:var(--vt-600); text-transform:uppercase; letter-spacing:1.1px; margin-bottom:5px; display:flex; align-items:center; }
        .vd-h1 { font-family:'Lexend',sans-serif; font-size:clamp(20px,2.4vw,26px); font-weight:800; color:var(--vs-900); letter-spacing:-.5px; margin-bottom:4px; }
        .vd-date { font-size:12.5px; color:var(--vs-400); font-weight:500; text-transform:capitalize; }
        .vd-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .vd-period { display:flex; background:var(--vs-100); border-radius:10px; padding:3px; gap:2px; border:1px solid var(--vs-200); }
        .vd-pb { padding:6px 11px; border-radius:7px; border:none; background:none; font-size:12px; font-weight:700; color:var(--vs-400); cursor:pointer; font-family:'Nunito',sans-serif; transition:all .15s; white-space:nowrap; }
        .vd-pb.act { background:var(--vw); color:var(--vs-800); box-shadow:0 1px 5px rgba(15,23,42,.1); }
        .vd-rbtn { display:flex; align-items:center; gap:6px; padding:8px 13px; border-radius:10px; border:1.5px solid var(--vs-200); background:var(--vw); font-size:12.5px; font-weight:700; color:var(--vs-500); cursor:pointer; font-family:'Nunito',sans-serif; transition:all .2s; }
        .vd-rbtn:hover { border-color:var(--vt-500); color:var(--vt-600); }
        .vd-rbtn.spin svg { animation:vdspin .7s linear; }
        @keyframes vdspin { to{ transform:rotate(360deg); } }
        .vd-newbtn { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:11px; border:none; background:linear-gradient(135deg,var(--vt-700),var(--vt-500)); color:white; font-size:13.5px; font-weight:700; font-family:'Nunito',sans-serif; cursor:pointer; box-shadow:0 3px 14px rgba(6,182,212,.28); transition:all .2s; }
        .vd-newbtn:hover { transform:translateY(-1px); box-shadow:0 7px 20px rgba(6,182,212,.38); }

        /* ── Alertas ── */
        .vd-alerts { display:flex; flex-direction:column; gap:7px; margin-bottom:20px; }
        .vd-al { display:flex; align-items:center; gap:10px; padding:10px 15px; border-radius:12px; animation:vdal .3s ease both; }
        @keyframes vdal { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
        .vd-al.red   { background:#fef2f2; border:1px solid #fecaca; }
        .vd-al.amber { background:#fffbeb; border:1px solid #fde68a; }
        .vd-al-ico { display:flex; flex-shrink:0; }
        .vd-al.red   .vd-al-ico { color:#ef4444; }
        .vd-al.amber .vd-al-ico { color:#d97706; }
        .vd-al-msg { flex:1; font-size:12.5px; font-weight:600; color:var(--vs-700); min-width:0; }
        .vd-al-btn { font-size:12px; font-weight:700; padding:5px 12px; border-radius:8px; border:none; cursor:pointer; font-family:'Nunito',sans-serif; flex-shrink:0; transition:all .15s; }
        .vd-al.red   .vd-al-btn { background:#fee2e2; color:#ef4444; }
        .vd-al.red   .vd-al-btn:hover { background:#fecaca; }
        .vd-al.amber .vd-al-btn { background:#fef3c7; color:#d97706; }
        .vd-al.amber .vd-al-btn:hover { background:#fde68a; }
        .vd-al-x { background:none; border:none; cursor:pointer; display:flex; color:var(--vs-300); padding:2px; transition:color .15s; flex-shrink:0; }
        .vd-al-x:hover { color:var(--vs-500); }

        /* ── Stats ── */
        .vd-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
        @media(max-width:1100px){.vd-stats{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:480px) {.vd-stats{grid-template-columns:1fr;}}
        .vd-stat { border-radius:16px; padding:20px; cursor:default; transition:transform .2s, box-shadow .2s; }
        .vd-stat:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(15,23,42,.07); }
        .vd-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
        .vd-stat-ico { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; }
        .vd-stat-badge { display:flex; align-items:center; gap:4px; padding:4px 9px; border-radius:100px; font-size:11.5px; font-weight:800; }
        .vd-stat-badge.up { background:#f0fdf4; color:#16a34a; }
        .vd-stat-badge.dn { background:#fef2f2; color:#ef4444; }
        .vd-stat-val  { font-family:'Lexend',sans-serif; font-size:26px; font-weight:800; color:var(--vs-900); letter-spacing:-.5px; line-height:1; margin-bottom:5px; }
        .vd-stat-lbl  { font-size:13px; font-weight:700; color:var(--vs-600); margin-bottom:3px; }
        .vd-stat-sub  { font-size:11.5px; color:var(--vs-400); font-weight:400; }

        /* ── Layout 2 columnas ── */
        .vd-cols { display:grid; grid-template-columns:1fr 320px; gap:16px; margin-bottom:16px; }
        @media(max-width:1100px){ .vd-cols { grid-template-columns:1fr; } }

        /* ── Card base ── */
        .vd-card { background:var(--vw); border-radius:18px; border:1px solid var(--vs-200); box-shadow:0 2px 8px rgba(15,23,42,.04); overflow:hidden; }
        .vd-card-h { display:flex; align-items:center; justify-content:space-between; padding:16px 20px 12px; border-bottom:1px solid var(--vs-100); }
        .vd-card-title { font-family:'Lexend',sans-serif; font-size:14.5px; font-weight:800; color:var(--vs-900); }
        .vd-card-link { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:700; color:var(--vt-600); background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; transition:color .15s; padding:0; }
        .vd-card-link:hover { color:var(--vt-400); }

        /* ── Pedidos recientes ── */
        .vd-orders-th { display:grid; grid-template-columns:58px 1fr auto 100px auto 14px; align-items:center; gap:10px; padding:8px 20px; background:var(--vs-50); border-bottom:1px solid var(--vs-100); font-size:10px; font-weight:700; color:var(--vs-400); text-transform:uppercase; letter-spacing:.7px; }
        @media(max-width:680px){ .vd-orders-th,.vd-or-row { grid-template-columns:58px 1fr 100px 14px !important; } .vd-or-amount, .vd-or-time { display:none !important; } }
        .vd-or-row { display:grid; grid-template-columns:58px 1fr auto 100px auto 14px; align-items:center; gap:10px; padding:12px 20px; border-bottom:1px solid var(--vs-50); cursor:pointer; transition:background .14s; }
        .vd-or-row:last-child { border-bottom:none; }
        .vd-or-row:hover { background:var(--vs-50); }
        .vd-or-id     { font-family:'Lexend',sans-serif; font-size:12.5px; font-weight:700; color:var(--vt-600); }
        .vd-or-name   { font-size:13px; font-weight:700; color:var(--vs-800); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .vd-or-prod   { font-size:11.5px; color:var(--vs-400); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:1px; }
        .vd-or-amount { font-family:'Lexend',sans-serif; font-size:13px; font-weight:800; color:var(--vs-900); white-space:nowrap; }
        .vd-or-badge  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:11px; font-weight:700; white-space:nowrap; }
        .vd-or-time   { font-size:11px; color:var(--vs-400); white-space:nowrap; text-align:right; }
        .vd-or-arr    { color:var(--vs-200); display:flex; transition:all .16s; }
        .vd-or-row:hover .vd-or-arr { color:var(--vt-500); transform:translateX(2px); }

        /* ── Columna derecha ── */
        .vd-right { display:flex; flex-direction:column; gap:16px; }

        /* ── Gráfico ── */
        .vd-chart-body { padding:16px 18px; }
        .vd-bars { display:flex; align-items:flex-end; gap:6px; height:84px; margin-bottom:10px; }
        .vd-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; height:100%; justify-content:flex-end; }
        .vd-bar { width:100%; border-radius:5px 5px 0 0; min-height:4px; cursor:pointer; transition:height .6s cubic-bezier(.34,1.56,.64,1), filter .15s; }
        .vd-bar.normal { background:linear-gradient(180deg, var(--vt-500), var(--vt-700)); }
        .vd-bar.today  { background:linear-gradient(180deg, #22d3ee, #0284c7); box-shadow:0 0 14px rgba(6,182,212,.45); }
        .vd-bar:hover  { filter:brightness(1.2); }
        .vd-bar-day    { font-size:10px; font-weight:700; color:var(--vs-400); }
        .vd-chart-ft   { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--vs-100); }
        .vd-chart-lbl  { font-size:11.5px; color:var(--vs-400); font-weight:500; }
        .vd-chart-total{ font-family:'Lexend',sans-serif; font-size:13px; font-weight:800; color:var(--vt-600); display:flex; align-items:center; gap:5px; }

        /* ── Acciones rápidas ── */
        .vd-quick-list { padding:12px; display:flex; flex-direction:column; gap:6px; }
        .vd-qbtn { display:flex; align-items:center; gap:11px; padding:10px 12px; border-radius:11px; border:1.5px solid var(--vs-200); background:var(--vs-50); cursor:pointer; font-family:'Nunito',sans-serif; transition:all .18s; width:100%; text-align:left; }
        .vd-qbtn:hover { border-color:var(--vt-400); background:rgba(6,182,212,.03); transform:translateX(2px); }
        .vd-q-ico { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .vd-q-lbl { font-size:13px; font-weight:700; color:var(--vs-700); flex:1; }
        .vd-q-arr { color:var(--vs-300); transition:all .18s; display:flex; }
        .vd-qbtn:hover .vd-q-arr { color:var(--vt-500); transform:translateX(2px); }

        /* ── Top Productos ── */
        .vd-prod-th { display:grid; grid-template-columns:40px 1fr 72px 90px 68px; align-items:center; gap:12px; padding:8px 20px; background:var(--vs-50); border-bottom:1px solid var(--vs-100); font-size:10px; font-weight:700; color:var(--vs-400); text-transform:uppercase; letter-spacing:.7px; }
        @media(max-width:680px){ .vd-prod-th, .vd-prod-row { grid-template-columns:40px 1fr 68px !important; } .vd-prod-sold, .vd-prod-rev { display:none !important; } }
        .vd-prod-row { display:grid; grid-template-columns:40px 1fr 72px 90px 68px; align-items:center; gap:12px; padding:12px 20px; border-bottom:1px solid var(--vs-50); cursor:pointer; transition:background .14s; }
        .vd-prod-row:last-child { border-bottom:none; }
        .vd-prod-row:hover { background:var(--vs-50); }
        .vd-prod-thumb { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
        .vd-prod-name  { font-size:13px; font-weight:700; color:var(--vs-800); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .vd-prod-cat   { font-size:11.5px; color:var(--vs-400); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:1px; }
        .vd-prod-sold  { text-align:right; }
        .vd-prod-sold-n { font-family:'Lexend',sans-serif; font-size:14px; font-weight:800; color:var(--vs-900); }
        .vd-prod-sold-l { font-size:10px; color:var(--vs-400); }
        .vd-prod-rev   { font-size:12.5px; font-weight:700; color:var(--vs-700); text-align:right; }
        .vd-prod-stk   { padding:4px 10px; border-radius:100px; font-size:11px; font-weight:700; text-align:center; white-space:nowrap; }
        .vd-prod-stk.ok  { background:#f0fdf4; color:#16a34a; }
        .vd-prod-stk.low { background:#fffbeb; color:#d97706; }
        .vd-prod-stk.out { background:#fef2f2; color:#ef4444; }
      `}</style>

      <div className={`vd${ready ? " in" : ""}`}>

        {/* ── HERO ── */}
        <div className="vd-hero">
          <div>
            <div className="vd-eyebrow"><span className="vd-gdot"/>Panel del vendedor</div>
            <h1 className="vd-h1">Dashboard</h1>
            <p className="vd-date">{today}</p>
          </div>
          <div className="vd-actions">
            <div className="vd-period">
              {[["Hoy","hoy"],["Semana","semana"],["Mes","mes"],["Año","año"]].map(([l,v]) => (
                <button key={v} className={`vd-pb${period===v?" act":""}`} onClick={() => setPeriod(v)}>{l}</button>
              ))}
            </div>
            <button className={`vd-rbtn${spin?" spin":""}`} onClick={doRefresh}>
              <IcoRefresh />Actualizar
            </button>
            <button className="vd-newbtn" onClick={() => navigate("/vendor/products/new")}>
              <IcoPlus />Nuevo producto
            </button>
          </div>
        </div>

        {/* ── ALERTAS ── */}
        {alerts.length > 0 && (
          <div className="vd-alerts">
            {alerts.map(a => (
              <div key={a.id} className={`vd-al ${a.sev}`}>
                <span className="vd-al-ico"><IcoAlert /></span>
                <span className="vd-al-msg">{a.msg}</span>
                <button className="vd-al-btn" onClick={() => navigate(a.path)}>{a.action}</button>
                <button className="vd-al-x"   onClick={() => dismissAlert(a.id)}><IcoX /></button>
              </div>
            ))}
          </div>
        )}

        {/* ── STATS ── */}
        <div className="vd-stats">
          {STATS.map((s, i) => <StatCard key={s.id} s={s} idx={i} />)}
        </div>

        {/* ── LAYOUT 2 COLUMNAS ── */}
        <div className="vd-cols">

          {/* Pedidos recientes */}
          <div className="vd-card">
            <div className="vd-card-h">
              <span className="vd-card-title">Pedidos recientes</span>
              <button className="vd-card-link" onClick={() => navigate("/vendor/orders")}>Ver todos <IcoArrow /></button>
            </div>
            <div className="vd-orders-th">
              <span>ID</span>
              <span>Cliente</span>
              <span>Monto</span>
              <span>Estado</span>
              <span>Hora</span>
              <span/>
            </div>
            {RECENT_ORDERS.map(o => {
              const st = STATUS_MAP[o.status];
              return (
                <div key={o.id} className="vd-or-row" onClick={() => navigate(`/vendor/orders/${o.id}`)}>
                  <div className="vd-or-id">{o.id}</div>
                  <div style={{minWidth:0}}>
                    <div className="vd-or-name">{o.customer}</div>
                    <div className="vd-or-prod">{o.product}</div>
                  </div>
                  <div className="vd-or-amount">{o.amount}</div>
                  <div className="vd-or-badge" style={{ background: st.bg, color: st.color }}>
                    <st.Ico />{st.label}
                  </div>
                  <div className="vd-or-time">{o.time}</div>
                  <div className="vd-or-arr"><IcoArrow /></div>
                </div>
              );
            })}
          </div>

          {/* Columna derecha */}
          <div className="vd-right">

            {/* Gráfico de barras semanal */}
            <div className="vd-card">
              <div className="vd-card-h">
                <span className="vd-card-title">Ventas 7 días</span>
                <button className="vd-card-link" onClick={() => navigate("/vendor/reports")}>Reportes <IcoArrow /></button>
              </div>
              <div className="vd-chart-body">
                <div className="vd-bars">
                  {CHART_DATA.map((d, i) => (
                    <div key={d.day} className="vd-bar-col">
                      <div
                        className={`vd-bar ${i === CHART_DATA.length - 1 ? "today" : "normal"}`}
                        style={{ height: ready ? `${(d.val / maxBar) * 100}%` : "0%" }}
                        title={`${d.day}: RD$${(d.val * 420).toLocaleString()}`}
                      />
                      <span className="vd-bar-day">{d.day}</span>
                    </div>
                  ))}
                </div>
                <div className="vd-chart-ft">
                  <span className="vd-chart-lbl">Semana actual</span>
                  <span className="vd-chart-total"><IcoBarChart /> RD$28,400</span>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="vd-card">
              <div className="vd-card-h">
                <span className="vd-card-title">Acciones rápidas</span>
              </div>
              <div className="vd-quick-list">
                {QUICK_ACTIONS.map(q => (
                  <button key={q.lbl} className="vd-qbtn" onClick={() => navigate(q.path)}>
                    <div className="vd-q-ico" style={{ background: q.bg, color: q.c }}><q.I /></div>
                    <span className="vd-q-lbl">{q.lbl}</span>
                    <span className="vd-q-arr"><IcoArrow /></span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── TOP PRODUCTOS ── */}
        <div className="vd-card">
          <div className="vd-card-h">
            <span className="vd-card-title">Productos más vendidos</span>
            <button className="vd-card-link" onClick={() => navigate("/vendor/products")}>Ver todos <IcoArrow /></button>
          </div>
          <div className="vd-prod-th">
            <span/>
            <span>Producto</span>
            <span className="vd-prod-sold" style={{textAlign:"right"}}>Vendidos</span>
            <span className="vd-prod-rev"  style={{textAlign:"right"}}>Ingresos</span>
            <span style={{textAlign:"center"}}>Stock</span>
          </div>
          {TOP_PRODUCTS.map(p => (
            <div key={p.id} className="vd-prod-row" onClick={() => navigate(`/vendor/products/${p.id}`)}>
              <div className="vd-prod-thumb" style={{ background: `${p.clr}20` }}>🛍️</div>
              <div style={{minWidth:0}}>
                <div className="vd-prod-name">{p.name}</div>
                <div className="vd-prod-cat">{p.catalog}</div>
              </div>
              <div className="vd-prod-sold" style={{textAlign:"right"}}>
                <div className="vd-prod-sold-n">{p.sold}</div>
                <div className="vd-prod-sold-l">unidades</div>
              </div>
              <div className="vd-prod-rev" style={{textAlign:"right"}}>{p.revenue}</div>
              <div className={`vd-prod-stk ${p.stock === 0 ? "out" : p.stock <= 5 ? "low" : "ok"}`} style={{textAlign:"center"}}>
                {p.stock === 0 ? "Agotado" : `${p.stock} ud.`}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}