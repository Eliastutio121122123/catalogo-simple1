from .client import odoo

USER_FIELDS = ["id", "name", "email", "phone", "partner_id", "group_ids", "login"]

ROLE_VENDOR = "vendor"
ROLE_CUSTOMER = "customer"

XMLID_BASE_INTERNAL = "base.group_user"
XMLID_BASE_PORTAL = "base.group_portal"
XMLID_VENDOR_CANDIDATES = [
    "sales_team.group_sale_salesman",
    "sales_team.group_sale_salesman_all_leads",
    "sale_management.group_sale_salesman",
    "sale.group_sale_salesman",
]
XMLID_SALES_CATEGORY_CANDIDATES = [
    "sales_team.module_category_sales_management",
    "sale.module_category_sales_management",
    "sale_management.module_category_sales_management",
]


class UserAlreadyExistsError(ValueError):
    pass


def normalize_email(email: str) -> str:
    return email.strip().lower()


def _xmlid_to_group_id(xmlid: str) -> int | None:
    if "." not in xmlid:
        return None
    module, name = xmlid.split(".", 1)
    rows = odoo.search_read(
        "ir.model.data",
        [["module", "=", module], ["name", "=", name], ["model", "=", "res.groups"]],
        ["res_id"],
        limit=1,
    )
    if not rows:
        return None
    return int(rows[0]["res_id"])


def _xmlid_to_record_id(xmlid: str, model: str) -> int | None:
    if "." not in xmlid:
        return None
    module, name = xmlid.split(".", 1)
    rows = odoo.search_read(
        "ir.model.data",
        [["module", "=", module], ["name", "=", name], ["model", "=", model]],
        ["res_id"],
        limit=1,
    )
    if not rows:
        return None
    return int(rows[0]["res_id"])


def _sales_category_id() -> int | None:
    for xmlid in XMLID_SALES_CATEGORY_CANDIDATES:
        cid = _xmlid_to_record_id(xmlid, "ir.module.category")
        if cid:
            return cid
    return None


def _sales_group_ids_from_category() -> list[int]:
    category_id = _sales_category_id()
    if not category_id:
        return []
    rows = odoo.search_read(
        "res.groups",
        [["category_id", "=", category_id]],
        ["id", "name"],
        limit=200,
    )
    if not rows:
        return []
    return [int(row["id"]) for row in rows if row.get("id")]


def _pick_vendor_group_from_category() -> int | None:
    category_id = _sales_category_id()
    if not category_id:
        return None
    rows = odoo.search_read(
        "res.groups",
        [["category_id", "=", category_id]],
        ["id", "name"],
        limit=200,
    )
    if not rows:
        return None

    # Prefer the most restrictive "user" sales group instead of manager/admin.
    candidates = sorted(rows, key=lambda r: int(r.get("id") or 0))
    filtered = []
    for row in candidates:
        name = str(row.get("name") or "").lower()
        if "manager" in name or "admin" in name or "administrador" in name:
            continue
        filtered.append(row)
    chosen = filtered[0] if filtered else candidates[0]
    return int(chosen["id"]) if chosen and chosen.get("id") else None


def _resolve_role_groups(role: str) -> list[int]:
    normalized_role = (role or ROLE_CUSTOMER).strip().lower()

    if normalized_role == ROLE_VENDOR:
        group_ids = []
        internal_group = _xmlid_to_group_id(XMLID_BASE_INTERNAL)
        if internal_group:
            group_ids.append(internal_group)
        for xmlid in XMLID_VENDOR_CANDIDATES:
            gid = _xmlid_to_group_id(xmlid)
            if gid:
                group_ids.append(gid)
                break
        if len(group_ids) <= 1:
            fallback_gid = _pick_vendor_group_from_category()
            if fallback_gid:
                group_ids.append(fallback_gid)
        return sorted(set(group_ids))

    portal_group = _xmlid_to_group_id(XMLID_BASE_PORTAL)
    return [portal_group] if portal_group else []


def _role_from_groups(group_ids: list[int] | None) -> str:
    ids = set(int(gid) for gid in (group_ids or []))
    for xmlid in XMLID_VENDOR_CANDIDATES:
        gid = _xmlid_to_group_id(xmlid)
        if gid and gid in ids:
            return ROLE_VENDOR
    sales_group_ids = set(_sales_group_ids_from_category())
    if ids.intersection(sales_group_ids):
        return ROLE_VENDOR
    return ROLE_CUSTOMER


def _normalize_user(user: dict) -> dict:
    out = dict(user)
    out["role"] = _role_from_groups(out.get("group_ids") or [])
    return out


def get_user_by_id(uid: int) -> dict:
    results = odoo.search_read("res.users", [["id", "=", uid]], USER_FIELDS, limit=1)
    if not results:
        raise LookupError(f"User {uid} not found")
    return _normalize_user(results[0])


def get_user_by_email(email: str) -> dict | None:
    normalized = normalize_email(email)
    results = odoo.search_read(
        "res.users",
        ["|", ["login", "=", normalized], ["email", "=", normalized]],
        USER_FIELDS,
        limit=1,
    )
    return _normalize_user(results[0]) if results else None


def create_user(
    name: str,
    email: str,
    password: str,
    role: str = ROLE_CUSTOMER,
    phone: str | None = None,
    company: str | None = None,
) -> int:
    normalized = normalize_email(email)
    if get_user_by_email(normalized):
        raise UserAlreadyExistsError("Email is already registered")

    values = {
        "name": name.strip(),
        "login": normalized,
        "email": normalized,
        "password": password,
    }
    if phone:
        values["phone"] = str(phone).strip()
    if company:
        values["company_name"] = str(company).strip()

    groups = _resolve_role_groups(role)
    if groups:
        values["group_ids"] = [(6, 0, groups)]

    uid = odoo.create("res.users", values)

    # Safety pass: if vendor was requested and role still resolves as customer,
    # apply a fallback sales group using category lookup.
    if (role or "").strip().lower() == ROLE_VENDOR:
        created = get_user_by_id(uid)
        if created.get("role") != ROLE_VENDOR:
            fallback_gid = _pick_vendor_group_from_category()
            if fallback_gid:
                odoo.write("res.users", [uid], {"group_ids": [(4, fallback_gid)]})

    return uid


def update_user(uid: int, values: dict) -> bool:
    if "email" in values and values["email"]:
        values["email"] = normalize_email(values["email"])
    return odoo.write("res.users", [uid], values)
