from odoo import http
from odoo.http import request

from .api_base import error, ok


PRODUCT_FIELDS = [
    "id",
    "name",
    "list_price",
    "description_sale",
    "image_url",
    "categ_id",
    "qty_available",
    "catalog_id",
    "standard_price",
    "product_variant_ids",
    "attribute_line_ids",
]


class CatalogixProductsController(http.Controller):
    @http.route("/api/products", type="http", auth="none", csrf=False, cors="*")
    def list_products(self, **kwargs):
        try:
            limit = int(request.httprequest.args.get("limit", 50))
            offset = int(request.httprequest.args.get("offset", 0))
        except Exception:
            limit, offset = 50, 0

        try:
            rows = (
                request.env["product.template"]
                .sudo()
                .search_read([("sale_ok", "=", True)], PRODUCT_FIELDS, limit=limit, offset=offset)
            )
            return ok(rows)
        except Exception as exc:
            return error(str(exc), 500)

    @http.route("/api/products/search", type="http", auth="none", csrf=False, cors="*")
    def search_products(self, **kwargs):
        query = request.httprequest.args.get("q", "") or ""
        category = request.httprequest.args.get("category")
        min_price = request.httprequest.args.get("min_price")
        max_price = request.httprequest.args.get("max_price")
        try:
            limit = int(request.httprequest.args.get("limit", 50))
            offset = int(request.httprequest.args.get("offset", 0))
        except Exception:
            limit, offset = 50, 0

        domain = [("name", "ilike", query)]
        if category:
            domain.append(("categ_id.name", "=", category))
        if min_price not in (None, ""):
            try:
                domain.append(("list_price", ">=", float(min_price)))
            except Exception:
                pass
        if max_price not in (None, ""):
            try:
                domain.append(("list_price", "<=", float(max_price)))
            except Exception:
                pass

        try:
            rows = (
                request.env["product.template"]
                .sudo()
                .search_read(domain, PRODUCT_FIELDS, limit=limit, offset=offset)
            )
            return ok(rows)
        except Exception as exc:
            return error(str(exc), 500)

    @http.route("/api/products/<int:product_id>", type="http", auth="none", csrf=False, cors="*")
    def get_product(self, product_id, **kwargs):
        rows = (
            request.env["product.template"]
            .sudo()
            .search_read([("id", "=", int(product_id))], PRODUCT_FIELDS, limit=1)
        )
        if not rows:
            return error(f"Product {product_id} not found", 404)
        return ok(rows[0])

