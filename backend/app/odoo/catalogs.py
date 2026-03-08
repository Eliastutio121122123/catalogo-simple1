from .client import odoo

CATALOG_FIELDS = ["id", "name", "description", "image_url", "vendor_id", "active"]
PRODUCT_FIELDS = ["id", "name", "list_price", "description", "image_url",
                  "categ_id", "qty_available", "catalog_id"]


def get_catalogs(limit=20, offset=0) -> list:
    return odoo.search_read("catalog.catalog", [["active", "=", True]],
                            CATALOG_FIELDS, limit=limit, offset=offset)


def get_catalog_by_id(catalog_id: int) -> dict:
    results = odoo.search_read("catalog.catalog", [["id", "=", catalog_id]],
                               CATALOG_FIELDS, limit=1)
    if not results:
        raise LookupError(f"Catalog {catalog_id} not found")
    return results[0]


def get_products_by_catalog(catalog_id: int, limit=50, offset=0) -> list:
    return odoo.search_read("product.template",
                            [["catalog_id", "=", catalog_id]],
                            PRODUCT_FIELDS, limit=limit, offset=offset)
