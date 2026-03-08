import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import customerPortalService from "../../services/odoo/customerPortalService";

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  address: "",
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", maximumFractionDigits: 0 }).format(Number(n || 0));

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await customerPortalService.getProfile();
        const rows = await customerPortalService.listOrders(me.partnerId);
        setProfile({ ...DEFAULT_PROFILE, ...me });
        setOrders(rows);
      } catch (e) {
        setError(e.message || "No se pudo cargar tu perfil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);
    return {
      orders: orders.length,
      totalSpent,
      active: orders.filter((o) => o.status === "processing" || o.status === "shipped").length,
    };
  }, [orders]);

  if (loading) {
    return <div style={{ color: "var(--c-slate-500)", fontSize: 13 }}>Cargando perfil...</div>;
  }

  return (
    <>
      <style>{`
        .cpf{display:flex;flex-direction:column;gap:14px}
        .cpf-title{font-family:'Lexend',sans-serif;font-size:24px;font-weight:800;color:var(--c-slate-900)}
        .cpf-sub{font-size:13px;color:var(--c-slate-500)}
        .cpf-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:12px}
        @media(max-width:900px){.cpf-grid{grid-template-columns:1fr}}
        .cpf-card{background:#fff;border:1px solid var(--c-slate-200);border-radius:16px;padding:14px}
        .cpf-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        @media(max-width:620px){.cpf-row{grid-template-columns:1fr}}
        .cpf-f{display:flex;flex-direction:column;gap:4px;padding:8px 0}
        .cpf-l{font-size:11px;font-weight:800;color:var(--c-slate-500);text-transform:uppercase}
        .cpf-v{font-size:14px;color:var(--c-slate-800);font-weight:700}
        .cpf-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
        .cpf-btn{padding:9px 12px;border-radius:10px;border:1.5px solid var(--c-slate-200);background:#fff;font-size:13px;font-weight:700;cursor:pointer;color:var(--c-slate-700)}
        .cpf-btn.pri{border:none;background:linear-gradient(135deg,var(--c-blue-600),var(--c-teal-500));color:#fff}
        .cpf-k-grid{display:grid;grid-template-columns:1fr;gap:10px}
        .cpf-k{border:1px solid var(--c-slate-100);border-radius:12px;padding:12px}
        .cpf-k-l{font-size:11px;font-weight:800;color:var(--c-slate-500);text-transform:uppercase}
        .cpf-k-v{font-family:'Lexend',sans-serif;font-size:24px;font-weight:800;color:var(--c-slate-900);margin-top:6px}
      `}</style>

      <div className="cpf">
        <div>
          <h1 className="cpf-title">Mi perfil</h1>
          <p className="cpf-sub">Resumen de tu cuenta y actividad reciente.</p>
          {error && <p style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginTop: 4 }}>{error}</p>}
        </div>

        <div className="cpf-grid">
          <section className="cpf-card">
            <div className="cpf-row">
              <div className="cpf-f"><span className="cpf-l">Nombre</span><span className="cpf-v">{profile.firstName} {profile.lastName}</span></div>
              <div className="cpf-f"><span className="cpf-l">Correo</span><span className="cpf-v">{profile.email}</span></div>
              <div className="cpf-f"><span className="cpf-l">Telefono</span><span className="cpf-v">{profile.phone || "-"}</span></div>
              <div className="cpf-f"><span className="cpf-l">Empresa</span><span className="cpf-v">{profile.company || "-"}</span></div>
              <div className="cpf-f"><span className="cpf-l">Ciudad</span><span className="cpf-v">{profile.city || "-"}</span></div>
              <div className="cpf-f"><span className="cpf-l">Direccion</span><span className="cpf-v">{profile.address || "-"}</span></div>
            </div>
            <div className="cpf-actions">
              <button className="cpf-btn pri" onClick={() => navigate("/customer/edit-profile")}>Editar perfil</button>
              <button className="cpf-btn" onClick={() => navigate("/customer/change-password")}>Cambiar contraseña</button>
            </div>
          </section>

          <aside className="cpf-k-grid">
            <article className="cpf-k">
              <div className="cpf-k-l">Pedidos realizados</div>
              <div className="cpf-k-v">{stats.orders}</div>
            </article>
            <article className="cpf-k">
              <div className="cpf-k-l">Total gastado</div>
              <div className="cpf-k-v">{fmtMoney(stats.totalSpent)}</div>
            </article>
            <article className="cpf-k">
              <div className="cpf-k-l">Pedidos activos</div>
              <div className="cpf-k-v">{stats.active}</div>
            </article>
          </aside>
        </div>
      </div>
    </>
  );
}
