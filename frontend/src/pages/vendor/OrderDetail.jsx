import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ─── Iconos ───────────────────────────────────────────────────────────────────
const IcoBack     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IcoCheck    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoX        = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoDownload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcoPrint    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const IcoTruck    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcoBell     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcoMail     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoPhone    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcoMap      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoNote     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IcoChevron  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoCancel   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const IcoSend     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcoEdit     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoExtern   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ORDERS = {
  "ORD-2401": {
    id:"ORD-2401", customer:"María Rodríguez", email:"maria@email.com", phone:"809-555-0001",
    catalog:"Nova Style", status:"delivered", payment:"tarjeta", paid:true, total:5850,
    date:"2025-01-28 09:14", address:"Av. Winston Churchill 45, Apto 3B, Piantini, Santo Domingo",
    notes:"Entregar en horario de mañana, portero se llama Juan.",
    products:[
      { id:1, name:"Vestido Floral Verano", sku:"VFV-001", img:"👗", price:1850, qty:1 },
      { id:2, name:"Blazer Oversize Gris",  sku:"BOG-002", img:"🧥", price:3200, qty:1 },
      { id:5, name:"Jeans Slim Azul",       sku:"JSA-005", img:"👖", price:1950, qty:1 },
    ],
    timeline:[
      { status:"pending",    label:"Pedido recibido",   date:"2025-01-28 09:14", note:"El cliente realizó el pedido vía catálogo." },
      { status:"processing", label:"Procesando",         date:"2025-01-28 10:30", note:"Pago confirmado. Preparando productos." },
      { status:"shipped",    label:"Enviado",            date:"2025-01-28 15:45", note:"Paquete entregado a Servi Express. Tracking: SX-8820." },
      { status:"delivered",  label:"Entregado",          date:"2025-01-29 11:20", note:"Entrega confirmada por el cliente." },
    ],
    internalNotes:[
      { author:"Carlos (Admin)", date:"2025-01-28 10:32", text:"Cliente VIP, priorizar envío." },
    ],
  },
  "ORD-2400": {
    id:"ORD-2400", customer:"Carlos Méndez", email:"carlos@email.com", phone:"849-555-0002",
    catalog:"FitLife Store", status:"shipped", payment:"transferencia", paid:true, total:9900,
    date:"2025-01-27 14:22", address:"Calle El Conde 22, Santiago de los Caballeros",
    notes:"",
    products:[
      { id:3, name:"Tenis Running Nike Air", sku:"TNA-003", img:"👟", price:6500, qty:1 },
      { id:6, name:"Set Yoga Premium",       sku:"SYP-006", img:"🧘", price:3400, qty:1 },
    ],
    timeline:[
      { status:"pending",    label:"Pedido recibido",  date:"2025-01-27 14:22", note:"" },
      { status:"processing", label:"Procesando",        date:"2025-01-27 16:00", note:"Transferencia verificada." },
      { status:"shipped",    label:"Enviado",           date:"2025-01-28 09:00", note:"En camino vía Caribe Express. Tracking: CE-44201." },
    ],
    internalNotes:[],
  },
  "ORD-2398": {
    id:"ORD-2398", customer:"Pedro García", email:"pedro@email.com", phone:"809-555-0004",
    catalog:"Nova Style", status:"pending", payment:"contra entrega", paid:false, total:3200,
    date:"2025-01-26 18:05", address:"Calle Las Damas 15, Ciudad Colonial, Santo Domingo",
    notes:"Llamar antes de llegar.",
    products:[
      { id:2, name:"Blazer Oversize Gris", sku:"BOG-002", img:"🧥", price:3200, qty:1 },
    ],
    timeline:[
      { status:"pending", label:"Pedido recibido", date:"2025-01-26 18:05", note:"Pedido vía catálogo Nova Style." },
    ],
    internalNotes:[],
  },
};

// Fallback genérico
const makeGeneric = id => ({
  id, customer:"Cliente", email:"cliente@email.com", phone:"809-000-0000",
  catalog:"Catálogo", status:"pending", payment:"tarjeta", paid:true, total:0,
  date:"2025-01-28 00:00", address:"Dirección de entrega",
  notes:"", products:[], timeline:[{ status:"pending", label:"Pedido recibido", date:"2025-01-28 00:00", note:"" }],
  internalNotes:[],
});

const STATUS_CFG = {
  pending:    { label:"Pendiente",  bg:"#fffbeb", clr:"#d97706", dot:"#d97706" },
  processing: { label:"Procesando", bg:"#eff6ff", clr:"#2563eb", dot:"#3b82f6" },
  shipped:    { label:"Enviado",    bg:"#f0fdf4", clr:"#16a34a", dot:"#22c55e" },
  delivered:  { label:"Entregado",  bg:"#f0fdf4", clr:"#15803d", dot:"#16a34a" },
  cancelled:  { label:"Cancelado",  bg:"#fef2f2", clr:"#ef4444", dot:"#ef4444" },
};

const STATUS_FLOW = ["pending","processing","shipped","delivered"];

const fmt  = n => "RD$" + (n || 0).toLocaleString("es-DO");
const fmtDT= s => {
  if (!s) return "";
  const [date, time] = s.split(" ");
  const [y,m,d] = date.split("-");
  return `${d}/${m}/${y}${time ? " · " + time : ""}`;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OrderDetail() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [ready,      setReady    ] = useState(false);
  const [order,      setOrder    ] = useState(null);
  const [statusOpen, setStatusOpen]=useState(false);
  const [noteText,   setNoteText ] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [showTracking,  setShowTracking ] = useState(false);
  const [saving,     setSaving   ] = useState(false);

  useEffect(() => {
    const data = MOCK_ORDERS[id] || makeGeneric(id);
    setOrder(data);
    setTimeout(() => setReady(true), 60);
  }, [id]);

  if (!order) return null;

  const st  = STATUS_CFG[order.status];
  const subtotal = order.products.reduce((s, p) => s + p.price * p.qty, 0);
  const itbis    = Math.round(subtotal * 0.18);
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1] || null;

  const changeStatus = newStatus => {
    const cfg = STATUS_CFG[newStatus];
    const newEvent = {
      status: newStatus,
      label: cfg.label,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      note: "",
    };
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      timeline: [...prev.timeline, newEvent],
    }));
    setStatusOpen(false);
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = { author:"Tú", date: new Date().toISOString().slice(0, 16).replace("T", " "), text: noteText.trim() };
    setOrder(prev => ({ ...prev, internalNotes: [...prev.internalNotes, newNote] }));
    setNoteText("");
  };

  const advanceStatus = async () => {
    if (!nextStatus) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    changeStatus(nextStatus);
    setSaving(false);
  };

  const currentStepIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled    = order.status === "cancelled";

  return (
    <>
      <style>{`
        .od { opacity:0; transform:translateY(6px); transition:opacity .35s ease, transform .35s ease; }
        .od.in { opacity:1; transform:translateY(0); }

        /* ── Header ── */
        .od-header { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .od-back { width:36px; height:36px; border-radius:10px; border:1.5px solid var(--vs-200); background:var(--vw); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--vs-500); transition:all .18s; flex-shrink:0; }
        .od-back:hover { border-color:var(--vt-400); color:var(--vt-600); }
        .od-header-info { flex:1; min-width:0; }
        .od-eyebrow { font-size:11px; font-weight:700; color:var(--vs-400); margin-bottom:3px; }
        .od-h1 { font-family:'Lexend',sans-serif; font-size:clamp(16px,2vw,22px); font-weight:800; color:var(--vs-900); letter-spacing:-.4px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .od-header-r { display:flex; gap:8px; flex-wrap:wrap; }
        .od-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:10px; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; cursor:pointer; transition:all .18s; white-space:nowrap; }
        .od-btn-ghost { border:1.5px solid var(--vs-200); background:var(--vw); color:var(--vs-600); }
        .od-btn-ghost:hover { border-color:var(--vs-400); color:var(--vs-800); }
        .od-btn-primary { border:none; background:linear-gradient(135deg,var(--vt-700),var(--vt-500)); color:white; box-shadow:0 3px 12px rgba(6,182,212,.28); }
        .od-btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(6,182,212,.38); }
        .od-btn-primary:disabled { opacity:.6; cursor:not-allowed; }
        .od-btn-danger { border:1.5px solid rgba(239,68,68,.3); background:rgba(239,68,68,.07); color:#ef4444; }
        .od-btn-danger:hover { background:rgba(239,68,68,.13); border-color:rgba(239,68,68,.5); }
        .od-btn-green  { border:1.5px solid rgba(22,163,74,.3); background:rgba(22,163,74,.08); color:#16a34a; }
        .od-btn-green:hover { background:rgba(22,163,74,.14); }
        .od-spin { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:odspin .65s linear infinite; flex-shrink:0; }
        @keyframes odspin { to{ transform:rotate(360deg); } }

        /* ── Badge estado ── */
        .od-badge { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; border-radius:100px; font-size:12px; font-weight:700; cursor:pointer; transition:filter .15s; }
        .od-badge:hover { filter:brightness(.95); }
        .od-badge-dot { width:6px; height:6px; border-radius:50%; }

        /* ── Status dropdown ── */
        .od-sd-wrap { position:relative; }
        .od-sd { position:absolute; top:calc(100% + 6px); left:0; width:195px; background:var(--vw); border:1px solid var(--vs-200); border-radius:14px; box-shadow:0 12px 40px rgba(15,23,42,.12); z-index:100; overflow:hidden; padding:5px; animation:oddd .15s ease; }
        @keyframes oddd { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .od-sd-title { font-size:9.5px; font-weight:800; color:var(--vs-400); text-transform:uppercase; letter-spacing:.9px; padding:7px 10px 4px; }
        .od-sd-item { display:flex; align-items:center; gap:9px; width:100%; padding:9px 10px; border-radius:8px; border:none; background:none; font-size:13px; font-weight:600; color:var(--vs-700); cursor:pointer; font-family:'Nunito',sans-serif; transition:background .13s; text-align:left; }
        .od-sd-item:hover { background:var(--vs-50); color:var(--vs-900); }
        .od-sd-item.cur { background:rgba(6,182,212,.07); color:var(--vt-700); font-weight:700; }
        .od-sd-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .od-sd-chk { margin-left:auto; color:var(--vt-600); display:flex; }

        /* ── Layout ── */
        .od-layout { display:grid; grid-template-columns:1fr 300px; gap:16px; align-items:start; }
        @media(max-width:960px) { .od-layout { grid-template-columns:1fr; } }
        .od-main { display:flex; flex-direction:column; gap:16px; }
        .od-side { display:flex; flex-direction:column; gap:14px; }

        /* ── Card ── */
        .od-card { background:var(--vw); border-radius:18px; border:1px solid var(--vs-200); box-shadow:0 2px 8px rgba(15,23,42,.04); overflow:hidden; }
        .od-card-head { padding:15px 20px 12px; border-bottom:1px solid var(--vs-100); display:flex; align-items:center; justify-content:space-between; gap:10px; }
        .od-card-title { font-family:'Lexend',sans-serif; font-size:14px; font-weight:800; color:var(--vs-900); display:flex; align-items:center; gap:8px; }
        .od-card-body { padding:18px 20px; display:flex; flex-direction:column; gap:14px; }

        /* ── Timeline ── */
        .od-timeline { display:flex; flex-direction:column; gap:0; }
        .od-tl-item { display:flex; gap:14px; position:relative; padding-bottom:22px; }
        .od-tl-item:last-child { padding-bottom:0; }
        .od-tl-left { display:flex; flex-direction:column; align-items:center; gap:0; flex-shrink:0; width:28px; }
        .od-tl-dot  { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; z-index:1; border:2px solid var(--vw); }
        .od-tl-dot.done { background:linear-gradient(135deg,var(--vt-700),var(--vt-500)); box-shadow:0 2px 8px rgba(6,182,212,.3); }
        .od-tl-dot.cur  { background:linear-gradient(135deg,#1d4ed8,#06b6d4); box-shadow:0 2px 10px rgba(6,182,212,.4); animation:odpulse 2s ease infinite; }
        @keyframes odpulse { 0%,100%{box-shadow:0 0 0 0 rgba(6,182,212,.4)} 50%{box-shadow:0 0 0 6px rgba(6,182,212,0)} }
        .od-tl-dot.pending { background:var(--vs-200); }
        .od-tl-line { flex:1; width:2px; background:var(--vs-200); margin-top:2px; }
        .od-tl-line.done { background:linear-gradient(180deg,var(--vt-500),var(--vt-300)); }
        .od-tl-content { flex:1; padding-top:3px; }
        .od-tl-label { font-size:13.5px; font-weight:700; color:var(--vs-800); margin-bottom:2px; }
        .od-tl-label.done { color:var(--vs-900); }
        .od-tl-label.pending-st { color:var(--vs-400); }
        .od-tl-date  { font-size:11.5px; color:var(--vs-400); margin-bottom:4px; }
        .od-tl-note  { font-size:12.5px; color:var(--vs-500); line-height:1.55; background:var(--vs-50); padding:8px 12px; border-radius:9px; border-left:3px solid var(--vt-300); }

        /* Progress bar compacto */
        .od-progress { display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin-bottom:4px; position:relative; }
        .od-progress::before { content:""; position:absolute; top:10px; left:0; right:0; height:3px; background:var(--vs-200); border-radius:2px; z-index:0; }
        .od-progress-fill { position:absolute; top:10px; left:0; height:3px; background:linear-gradient(90deg,var(--vt-700),var(--vt-500)); border-radius:2px; z-index:1; transition:width .5s ease; }
        .od-prog-step { display:flex; flex-direction:column; align-items:center; gap:5px; z-index:2; }
        .od-prog-dot  { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2.5px solid var(--vs-200); background:var(--vw); transition:all .3s; }
        .od-prog-dot.done    { background:linear-gradient(135deg,var(--vt-700),var(--vt-500)); border-color:transparent; box-shadow:0 2px 8px rgba(6,182,212,.3); }
        .od-prog-dot.current { background:var(--vw); border-color:var(--vt-500); box-shadow:0 0 0 3px rgba(6,182,212,.2); }
        .od-prog-lbl  { font-size:10px; font-weight:700; color:var(--vs-400); text-align:center; }
        .od-prog-lbl.done    { color:var(--vt-600); }
        .od-prog-lbl.current { color:var(--vs-700); font-weight:800; }

        /* ── Productos ── */
        .od-prod-item { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--vs-50); }
        .od-prod-item:last-child { border-bottom:none; }
        .od-prod-thumb { width:46px; height:46px; border-radius:11px; background:var(--vs-100); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .od-prod-name  { font-size:13.5px; font-weight:700; color:var(--vs-800); margin-bottom:2px; }
        .od-prod-sku   { font-size:11px; color:var(--vs-400); font-family:monospace; }
        .od-prod-qty   { font-size:12.5px; color:var(--vs-500); font-weight:600; }
        .od-prod-price { font-family:'Lexend',sans-serif; font-size:14px; font-weight:800; color:var(--vs-900); margin-left:auto; white-space:nowrap; flex-shrink:0; }

        /* ── Resumen de pago ── */
        .od-pay-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; font-size:13.5px; border-bottom:1px solid var(--vs-50); }
        .od-pay-row:last-child { border-bottom:none; }
        .od-pay-lbl { color:var(--vs-500); font-weight:500; }
        .od-pay-val { font-weight:700; color:var(--vs-800); }
        .od-pay-total { font-family:'Lexend',sans-serif; font-size:16px; font-weight:800; color:var(--vs-900); }
        .od-pay-sep { height:1px; background:var(--vs-200); margin:4px 0; }
        .od-paid-badge { display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:100px; }

        /* ── Info cliente ── */
        .od-info-row { display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid var(--vs-50); font-size:13.5px; }
        .od-info-row:last-child { border-bottom:none; }
        .od-info-ico { color:var(--vs-400); flex-shrink:0; margin-top:1px; display:flex; }
        .od-info-val { color:var(--vs-800); font-weight:600; line-height:1.5; }
        .od-info-lbl { font-size:11px; color:var(--vs-400); font-weight:500; margin-top:1px; }

        /* ── Notas internas ── */
        .od-note-item { padding:10px 13px; background:var(--vs-50); border-radius:11px; border-left:3px solid var(--vt-300); }
        .od-note-meta { font-size:11px; color:var(--vs-400); margin-bottom:4px; font-weight:600; }
        .od-note-text { font-size:13px; color:var(--vs-700); line-height:1.55; }
        .od-note-input { width:100%; padding:10px 13px; border:1.5px solid var(--vs-200); border-radius:11px; background:var(--vs-50); font-size:13.5px; color:var(--vs-900); font-family:'Nunito',sans-serif; outline:none; resize:vertical; min-height:70px; transition:all .2s; line-height:1.6; }
        .od-note-input:focus { border-color:var(--vt-500); background:var(--vw); box-shadow:0 0 0 3px rgba(6,182,212,.1); }
        .od-note-input::placeholder { color:var(--vs-400); }
        .od-note-send { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:10px; border:none; background:linear-gradient(135deg,var(--vt-700),var(--vt-500)); color:white; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; cursor:pointer; transition:all .18s; }
        .od-note-send:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(6,182,212,.3); }
        .od-note-send:disabled { opacity:.5; cursor:not-allowed; transform:none; }

        /* ── Tracking ── */
        .od-tracking-box { background:rgba(6,182,212,.06); border:1px solid rgba(6,182,212,.2); border-radius:13px; padding:14px 16px; }
        .od-tracking-label { font-size:11px; font-weight:800; color:var(--vt-700); text-transform:uppercase; letter-spacing:.7px; margin-bottom:6px; }
        .od-tracking-num { font-family:monospace; font-size:15px; font-weight:700; color:var(--vt-600); letter-spacing:.5px; display:flex; align-items:center; gap:8px; }
        .od-tracking-ext { background:none; border:none; cursor:pointer; color:var(--vt-500); display:flex; padding:3px; border-radius:5px; transition:color .15s; }
        .od-tracking-ext:hover { color:var(--vt-700); }
        .od-tracking-input { width:100%; padding:9px 12px; border:1.5px solid var(--vs-200); border-radius:9px; background:var(--vw); font-size:13.5px; font-family:'Nunito',sans-serif; outline:none; color:var(--vs-900); transition:all .2s; }
        .od-tracking-input:focus { border-color:var(--vt-500); box-shadow:0 0 0 3px rgba(6,182,212,.1); }
        .od-tracking-save { margin-top:7px; display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; border:none; background:linear-gradient(135deg,var(--vt-700),var(--vt-500)); color:white; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; cursor:pointer; }

        /* ── Notas del cliente ── */
        .od-client-note { padding:12px 14px; background:#fffbeb; border:1px solid #fde68a; border-radius:12px; font-size:13px; color:#92400e; line-height:1.6; }
      `}</style>

      <div className={`od${ready ? " in" : ""}`}>

        {/* ── HEADER ── */}
        <div className="od-header">
          <button className="od-back" onClick={() => navigate("/vendor/orders")}><IcoBack /></button>
          <div className="od-header-info">
            <div className="od-eyebrow">Detalle del pedido</div>
            <div className="od-h1">
              {order.id}
              {/* Badge estado con dropdown */}
              <div className="od-sd-wrap">
                <div
                  className="od-badge"
                  style={{ background:st.bg, color:st.clr }}
                  onClick={() => setStatusOpen(v => !v)}
                >
                  <span className="od-badge-dot" style={{ background:st.dot }}/>
                  {st.label}
                  <IcoChevron />
                </div>
                {statusOpen && (
                  <div className="od-sd">
                    <div className="od-sd-title">Cambiar estado</div>
                    {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                      <button
                        key={val}
                        className={`od-sd-item${order.status === val ? " cur" : ""}`}
                        onClick={() => changeStatus(val)}
                      >
                        <span className="od-sd-dot" style={{ background:cfg.dot }}/>
                        {cfg.label}
                        {order.status === val && <span className="od-sd-chk"><IcoCheck /></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="od-header-r">
            <button className="od-btn od-btn-ghost"><IcoPrint />Imprimir</button>
            <button className="od-btn od-btn-ghost"><IcoDownload />Factura</button>
            {nextStatus && !isCancelled && (
              <button className="od-btn od-btn-primary" onClick={advanceStatus} disabled={saving}>
                {saving ? <><span className="od-spin"/>Guardando...</> : <><IcoTruck />Marcar como {STATUS_CFG[nextStatus]?.label}</>}
              </button>
            )}
          </div>
        </div>

        {/* ── LAYOUT ── */}
        <div className="od-layout">

          {/* ════ COLUMNA PRINCIPAL ════ */}
          <div className="od-main">

            {/* ─── PROGRESO ─── */}
            {!isCancelled && (
              <div className="od-card">
                <div className="od-card-head">
                  <div className="od-card-title">📦 Progreso del pedido</div>
                </div>
                <div className="od-card-body" style={{ paddingBottom:22 }}>
                  <div className="od-progress">
                    <div
                      className="od-progress-fill"
                      style={{ width: currentStepIdx < 0 ? "0%" : `${(currentStepIdx / 3) * 100}%` }}
                    />
                    {STATUS_FLOW.map((s, i) => {
                      const done    = i < currentStepIdx;
                      const current = i === currentStepIdx;
                      const cfg     = STATUS_CFG[s];
                      return (
                        <div key={s} className="od-prog-step">
                          <div className={`od-prog-dot${done ? " done" : current ? " current" : ""}`}>
                            {done    && <IcoCheck style={{ color:"white" }}/>}
                            {current && <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--vt-500)", display:"block" }}/>}
                          </div>
                          <div className={`od-prog-lbl${done ? " done" : current ? " current" : ""}`}>{cfg.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── LÍNEA DE TIEMPO ─── */}
            <div className="od-card">
              <div className="od-card-head">
                <div className="od-card-title">🕐 Historial</div>
              </div>
              <div className="od-card-body">
                <div className="od-timeline">
                  {order.timeline.map((event, i) => {
                    const isLast    = i === order.timeline.length - 1;
                    const cfg       = STATUS_CFG[event.status];
                    const isCurrent = isLast && !isCancelled;
                    return (
                      <div key={i} className="od-tl-item">
                        <div className="od-tl-left">
                          <div className={`od-tl-dot${isCurrent && !isCancelled ? " cur" : " done"}`} style={{ fontSize:12 }}>
                            {isCancelled && isLast ? "❌" : isLast ? "🔵" : "✅"}
                          </div>
                          {!isLast && <div className="od-tl-line done"/>}
                        </div>
                        <div className="od-tl-content">
                          <div className={`od-tl-label done`}>{event.label}</div>
                          <div className="od-tl-date">{fmtDT(event.date)}</div>
                          {event.note && <div className="od-tl-note">{event.note}</div>}
                        </div>
                      </div>
                    );
                  })}

                  {/* Pasos futuros */}
                  {!isCancelled && STATUS_FLOW.slice(currentStepIdx + 1).map((s, i) => {
                    const cfg = STATUS_CFG[s];
                    return (
                      <div key={s} className="od-tl-item">
                        <div className="od-tl-left">
                          <div className="od-tl-dot pending" style={{ opacity:.4 }}/>
                          {i < STATUS_FLOW.slice(currentStepIdx + 1).length - 1 && <div className="od-tl-line"/>}
                        </div>
                        <div className="od-tl-content">
                          <div className="od-tl-label pending-st">{cfg.label}</div>
                          <div className="od-tl-date" style={{ color:"var(--vs-300)" }}>Pendiente</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── PRODUCTOS ─── */}
            <div className="od-card">
              <div className="od-card-head">
                <div className="od-card-title">🛍️ Productos ({order.products.length})</div>
              </div>
              <div className="od-card-body" style={{ gap:0, padding:"0 20px" }}>
                {order.products.map(p => (
                  <div key={p.id} className="od-prod-item">
                    <div className="od-prod-thumb">{p.img}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="od-prod-name">{p.name}</div>
                      <div className="od-prod-sku">{p.sku}</div>
                      <div className="od-prod-qty">× {p.qty} unidad{p.qty > 1 ? "es" : ""}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div className="od-prod-price">{fmt(p.price * p.qty)}</div>
                      {p.qty > 1 && <div style={{ fontSize:11, color:"var(--vs-400)" }}>{fmt(p.price)} c/u</div>}
                    </div>
                  </div>
                ))}

                {/* Resumen de pago */}
                <div style={{ padding:"16px 0 14px", borderTop:"2px solid var(--vs-100)", marginTop:4 }}>
                  <div className="od-pay-row">
                    <span className="od-pay-lbl">Subtotal</span>
                    <span className="od-pay-val">{fmt(subtotal)}</span>
                  </div>
                  <div className="od-pay-row">
                    <span className="od-pay-lbl">ITBIS (18%)</span>
                    <span className="od-pay-val">{fmt(itbis)}</span>
                  </div>
                  <div className="od-pay-row">
                    <span className="od-pay-lbl">Envío</span>
                    <span className="od-pay-val" style={{ color:"#16a34a", fontWeight:700 }}>Gratis</span>
                  </div>
                  <div className="od-pay-sep"/>
                  <div className="od-pay-row">
                    <span style={{ fontWeight:800, color:"var(--vs-900)", fontSize:14 }}>Total</span>
                    <span className="od-pay-total">{fmt(order.total)}</span>
                  </div>
                  <div className="od-pay-row" style={{ paddingTop:6 }}>
                    <span className="od-pay-lbl">Método de pago</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"var(--vs-700)", textTransform:"capitalize" }}>{order.payment}</span>
                  </div>
                  <div className="od-pay-row">
                    <span className="od-pay-lbl">Estado de pago</span>
                    <span className={`od-paid-badge`} style={{ background: order.paid ? "#f0fdf4" : "#fef2f2", color: order.paid ? "#16a34a" : "#ef4444" }}>
                      {order.paid ? <><IcoCheck />Pagado</> : <><IcoX />Sin pagar</>}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── TRACKING ─── */}
            {(order.status === "shipped" || order.status === "processing") && (
              <div className="od-card">
                <div className="od-card-head">
                  <div className="od-card-title"><IcoTruck />Información de envío</div>
                  <button className="od-btn od-btn-ghost" style={{ padding:"6px 11px", fontSize:12 }} onClick={() => setShowTracking(v => !v)}>
                    <IcoEdit />{showTracking ? "Cancelar" : "Editar"}
                  </button>
                </div>
                <div className="od-card-body">
                  {order.timeline.find(t => t.status === "shipped")?.note ? (
                    <div className="od-tracking-box">
                      <div className="od-tracking-label">Número de seguimiento</div>
                      <div className="od-tracking-num">
                        {order.timeline.find(t => t.status === "shipped").note.match(/\w+-\d+/)?.[0] || "Pendiente"}
                        <button className="od-tracking-ext"><IcoExtern /></button>
                      </div>
                    </div>
                  ) : null}
                  {showTracking && (
                    <div>
                      <input className="od-tracking-input" placeholder="Ej. CE-44201, SX-8820..." value={trackingInput} onChange={e => setTrackingInput(e.target.value)} />
                      <button className="od-tracking-save" onClick={() => { setShowTracking(false); setTrackingInput(""); }}>
                        <IcoCheck />Guardar tracking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── NOTAS INTERNAS ─── */}
            <div className="od-card">
              <div className="od-card-head">
                <div className="od-card-title"><IcoNote />Notas internas</div>
              </div>
              <div className="od-card-body">
                {order.internalNotes.length > 0 ? (
                  order.internalNotes.map((n, i) => (
                    <div key={i} className="od-note-item">
                      <div className="od-note-meta">{n.author} · {fmtDT(n.date)}</div>
                      <div className="od-note-text">{n.text}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize:13, color:"var(--vs-400)", margin:0 }}>No hay notas internas aún.</p>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:8, borderTop:"1px solid var(--vs-100)", paddingTop:14 }}>
                  <textarea
                    className="od-note-input"
                    placeholder="Agrega una nota interna (solo visible para ti)..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                  />
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <button className="od-note-send" onClick={addNote} disabled={!noteText.trim()}>
                      <IcoSend />Agregar nota
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ════ COLUMNA LATERAL ════ */}
          <div className="od-side">

            {/* Info cliente */}
            <div className="od-card">
              <div className="od-card-head">
                <div className="od-card-title">👤 Cliente</div>
                <button className="od-btn od-btn-ghost" style={{ padding:"6px 11px", fontSize:12 }}>
                  <IcoMail />Contactar
                </button>
              </div>
              <div className="od-card-body" style={{ gap:0, padding:"0 20px" }}>
                <div className="od-info-row">
                  <div className="od-info-ico" style={{ marginTop:2 }}>👤</div>
                  <div>
                    <div className="od-info-val">{order.customer}</div>
                    <div className="od-info-lbl">Nombre completo</div>
                  </div>
                </div>
                <div className="od-info-row">
                  <span className="od-info-ico"><IcoMail /></span>
                  <div>
                    <div className="od-info-val">{order.email}</div>
                    <div className="od-info-lbl">Correo electrónico</div>
                  </div>
                </div>
                <div className="od-info-row">
                  <span className="od-info-ico"><IcoPhone /></span>
                  <div>
                    <div className="od-info-val">{order.phone}</div>
                    <div className="od-info-lbl">Teléfono</div>
                  </div>
                </div>
                <div className="od-info-row">
                  <span className="od-info-ico" style={{ marginTop:2 }}><IcoMap /></span>
                  <div>
                    <div className="od-info-val">{order.address}</div>
                    <div className="od-info-lbl">Dirección de entrega</div>
                  </div>
                </div>
              </div>
              <div style={{ padding:"0 20px 16px" }}>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="od-btn od-btn-ghost" style={{ flex:1, justifyContent:"center", padding:"8px", fontSize:12 }}>
                    <IcoMail />Email
                  </button>
                  <button className="od-btn od-btn-ghost" style={{ flex:1, justifyContent:"center", padding:"8px", fontSize:12 }}>
                    <IcoPhone />Llamar
                  </button>
                  <button className="od-btn od-btn-ghost" style={{ flex:1, justifyContent:"center", padding:"8px", fontSize:12 }}>
                    <IcoBell />Notificar
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="od-card">
              <div className="od-card-head">
                <div className="od-card-title">📋 Resumen</div>
              </div>
              <div className="od-card-body" style={{ gap:0, padding:"0 20px" }}>
                {[
                  { lbl:"Pedido",        val: order.id         },
                  { lbl:"Fecha",         val: fmtDT(order.date)},
                  { lbl:"Catálogo",      val: order.catalog    },
                  { lbl:"Artículos",     val: `${order.products.length} producto${order.products.length > 1 ? "s" : ""}` },
                  { lbl:"Total",         val: fmt(order.total), bold:true },
                ].map((r, i) => (
                  <div key={i} className="od-pay-row">
                    <span className="od-pay-lbl">{r.lbl}</span>
                    <span style={{ fontWeight: r.bold ? 800 : 700, color: r.bold ? "var(--vt-600)" : "var(--vs-800)", fontFamily: r.bold ? "'Lexend',sans-serif" : "inherit", fontSize: r.bold ? 15 : 13 }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota del cliente */}
            {order.notes && (
              <div className="od-card">
                <div className="od-card-head">
                  <div className="od-card-title">💬 Nota del cliente</div>
                </div>
                <div className="od-card-body">
                  <div className="od-client-note">{order.notes}</div>
                </div>
              </div>
            )}

            {/* Acción peligrosa */}
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                className="od-btn od-btn-danger"
                style={{ width:"100%", justifyContent:"center" }}
                onClick={() => changeStatus("cancelled")}
              >
                <IcoCancel />Cancelar pedido
              </button>
            )}

          </div>
        </div>
      </div>
    </>
  );
}