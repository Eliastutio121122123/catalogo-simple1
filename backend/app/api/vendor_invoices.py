from flask import Blueprint, request
from xmlrpc.client import Fault

from ..middleware.auth_guard import jwt_required
from ..odoo.invoices import (
    get_vendor_invoice,
    list_vendor_invoices,
    mark_vendor_invoice_paid,
    update_vendor_invoice_status,
)
from ..utils.response import error, success

bp = Blueprint("vendor_invoices", __name__)


def _is_invoice_model_missing(exc: Exception) -> bool:
    if not isinstance(exc, Fault):
        return False
    msg = str(exc).lower()
    return "account.move" in msg and ("does not exist" in msg or "invalid" in msg or "model" in msg)


def _model_missing_response():
    return error(
        "Odoo accounting models are missing. Install the Invoicing (account) app in Odoo.",
        503,
    )


@bp.get("")
@jwt_required
def list_invoices():
    uid = int(request.jwt_payload.get("uid"))
    try:
        return success(list_vendor_invoices(uid))
    except Exception as exc:
        if _is_invoice_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.get("/<int:invoice_id>")
@jwt_required
def get_invoice(invoice_id: int):
    uid = int(request.jwt_payload.get("uid"))
    try:
        return success(get_vendor_invoice(uid, invoice_id))
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_invoice_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.patch("/<int:invoice_id>/status")
@jwt_required
def update_status(invoice_id: int):
    uid = int(request.jwt_payload.get("uid"))
    data = request.get_json() or {}
    status = data.get("status")
    if not status:
        return error("Field 'status' is required", 400)
    try:
        return success(update_vendor_invoice_status(uid, invoice_id, str(status)))
    except LookupError as exc:
        return error(str(exc), 404)
    except ValueError as exc:
        return error(str(exc), 400)
    except Exception as exc:
        if _is_invoice_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.post("/<int:invoice_id>/mark-paid")
@jwt_required
def mark_paid(invoice_id: int):
    uid = int(request.jwt_payload.get("uid"))
    data = request.get_json() or {}
    method = str(data.get("method") or "manual")
    try:
        return success(mark_vendor_invoice_paid(uid, invoice_id, method=method))
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_invoice_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)
