from flask import Blueprint, request
from ..odoo.products import get_products, get_product_by_id, search_products
from ..utils.response import success, error

bp = Blueprint("products", __name__)


@bp.get("/")
def list_products():
    limit  = int(request.args.get("limit", 50))
    offset = int(request.args.get("offset", 0))
    try:
        return success(get_products(limit=limit, offset=offset))
    except Exception as e:
        return error(str(e), 500)


@bp.get("/search")
def search():
    query   = request.args.get("q", "")
    filters = {
        "category":  request.args.get("category"),
        "min_price": request.args.get("min_price"),
        "max_price": request.args.get("max_price"),
    }
    limit  = int(request.args.get("limit", 50))
    offset = int(request.args.get("offset", 0))
    try:
        return success(search_products(query, filters, limit, offset))
    except Exception as e:
        return error(str(e), 500)


@bp.get("/<int:product_id>")
def get_product(product_id):
    try:
        return success(get_product_by_id(product_id))
    except LookupError as e:
        return error(str(e), 404)
