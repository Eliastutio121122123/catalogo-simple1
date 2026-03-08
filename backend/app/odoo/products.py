from .client import odoo

PRODUCT_FIELDS = [
    "id", "name", "list_price", "description_sale", "image_url",
    "categ_id", "qty_available", "catalog_id", "standard_price",
    "product_variant_ids", "attribute_line_ids"
]


def get_products(domain=None, limit=50, offset=0) -> list:
    return odoo.search_read("product.template",
                            domain or [["sale_ok", "=", True]],
                            PRODUCT_FIELDS, limit=limit, offset=offset)


def get_product_by_id(product_id: int) -> dict:
    results = odoo.search_read("product.template",
                               [["id", "=", product_id]],
                               PRODUCT_FIELDS, limit=1)
    if not results:
        raise LookupError(f"Product {product_id} not found")
    return results[0]


def search_products(query: str, filters: dict = None, limit=50, offset=0) -> list:
    domain = [["name", "ilike", query]]
    if filters:
        if filters.get("category"):
            domain.append(["categ_id.name", "=", filters["category"]])
        if filters.get("min_price"):
            domain.append(["list_price", ">=", float(filters["min_price"])])
        if filters.get("max_price"):
            domain.append(["list_price", "<=", float(filters["max_price"])])
    return odoo.search_read("product.template", domain,
                            PRODUCT_FIELDS, limit=limit, offset=offset)
