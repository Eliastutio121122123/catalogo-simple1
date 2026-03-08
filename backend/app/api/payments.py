from flask import Blueprint, request
from ..utils.response import success, error
from ..middleware.auth_guard import jwt_required

bp = Blueprint("payments", __name__)


@bp.post("/checkout")
@jwt_required
def checkout():
    """
    Punto de integración para pasarela de pago (Stripe / PayPal / Azul).
    TODO: implementar lógica de pago real.
    """
    data = request.get_json() or {}
    # Aquí conectar con tu pasarela de pagos
    return success({"message": "Payment endpoint ready", "data": data})


@bp.post("/webhook")
def webhook():
    """Webhook para notificaciones de la pasarela de pago."""
    payload = request.get_json() or {}
    # TODO: verificar firma y actualizar estado del pedido en Odoo
    return success({"received": True})
