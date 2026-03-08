from .client import odoo

ORDER_FIELDS = ["id", "name", "state", "amount_total", "partner_id",
                "date_order", "order_line"]
LINE_FIELDS  = ["id", "product_id", "product_uom_qty", "price_unit", "price_subtotal"]


def create_order(partner_id: int, lines: list) -> int:
    """Crea un sale.order en Odoo. lines = [{"product_id": x, "qty": y, "price": z}]"""
    order_id = odoo.create("sale.order", {"partner_id": partner_id})
    for line in lines:
        odoo.create("sale.order.line", {
            "order_id":        order_id,
            "product_id":      line["product_id"],
            "product_uom_qty": line["qty"],
            "price_unit":      line["price"],
        })
    return order_id


def get_orders_by_partner(partner_id: int) -> list:
    return odoo.search_read("sale.order",
                            [["partner_id", "=", partner_id]],
                            ORDER_FIELDS)


def get_order_by_id(order_id: int) -> dict:
    results = odoo.search_read("sale.order", [["id", "=", order_id]],
                               ORDER_FIELDS, limit=1)
    if not results:
        raise LookupError(f"Order {order_id} not found")
    order = results[0]
    order["lines"] = odoo.read("sale.order.line", order["order_line"], LINE_FIELDS)
    return order


def confirm_order(order_id: int) -> bool:
    return odoo.call("sale.order", "action_confirm", [[order_id]])
