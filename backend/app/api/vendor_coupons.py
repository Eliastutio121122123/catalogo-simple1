from flask import Blueprint, request
from xmlrpc.client import Fault

from ..middleware.auth_guard import jwt_required
from ..odoo.coupons import (
    create_vendor_coupon,
    delete_vendor_coupon,
    duplicate_vendor_coupon,
    get_vendor_coupon,
    list_vendor_coupons,
    toggle_vendor_coupon_status,
    update_vendor_coupon,
)
from ..utils.response import error, success
from ..utils.validators import require_fields

bp = Blueprint("vendor_coupons", __name__)


def _is_coupon_model_missing(exc: Exception) -> bool:
    if not isinstance(exc, Fault):
        return False
    msg = str(exc).lower()
    return "catalog.coupon".lower() in msg and ("does not exist" in msg or "invalid" in msg or "model" in msg)


def _model_missing_response():
    return error(
        "Odoo model catalog.coupon is missing. Install/update the custom module 'Catalogix Digital' in Odoo Apps.",
        503,
    )


@bp.get("")
@jwt_required
def list_coupons():
    uid = int(request.jwt_payload.get("uid"))
    try:
        return success(list_vendor_coupons(uid))
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.get("/<int:coupon_id>")
@jwt_required
def get_coupon(coupon_id: int):
    uid = int(request.jwt_payload.get("uid"))
    try:
        return success(get_vendor_coupon(uid, coupon_id))
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.post("")
@jwt_required
def create_coupon():
    uid = int(request.jwt_payload.get("uid"))
    data = request.get_json() or {}
    err = require_fields(data, ["code", "type", "value"])
    if err:
        return error(err, 400)

    try:
        return success(create_vendor_coupon(uid, data), 201)
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.put("/<int:coupon_id>")
@jwt_required
def update_coupon(coupon_id: int):
    uid = int(request.jwt_payload.get("uid"))
    data = request.get_json() or {}
    err = require_fields(data, ["code", "type", "value"])
    if err:
        return error(err, 400)

    try:
        return success(update_vendor_coupon(uid, coupon_id, data))
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.patch("/<int:coupon_id>/status")
@jwt_required
def toggle_coupon_status(coupon_id: int):
    uid = int(request.jwt_payload.get("uid"))
    try:
        return success(toggle_vendor_coupon_status(uid, coupon_id))
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.post("/<int:coupon_id>/duplicate")
@jwt_required
def duplicate_coupon(coupon_id: int):
    uid = int(request.jwt_payload.get("uid"))
    try:
        return success(duplicate_vendor_coupon(uid, coupon_id), 201)
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)


@bp.delete("/<int:coupon_id>")
@jwt_required
def delete_coupon(coupon_id: int):
    uid = int(request.jwt_payload.get("uid"))
    try:
        delete_vendor_coupon(uid, coupon_id)
        return success({"message": "Coupon deleted"})
    except LookupError as exc:
        return error(str(exc), 404)
    except Exception as exc:
        if _is_coupon_model_missing(exc):
            return _model_missing_response()
        return error(str(exc), 500)
