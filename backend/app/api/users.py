from flask import Blueprint, request
from ..odoo.users import get_user_by_id, update_user
from ..utils.response import success, error
from ..middleware.auth_guard import jwt_required

bp = Blueprint("users", __name__)


@bp.get("/me")
@jwt_required
def me():
    uid = request.jwt_payload.get("uid")
    try:
        return success(get_user_by_id(uid))
    except LookupError as e:
        return error(str(e), 404)
    except Exception as e:
        return error(str(e), 500)


@bp.put("/me")
@jwt_required
def update_me():
    uid  = request.jwt_payload.get("uid")
    data = request.get_json() or {}
    try:
        update_user(uid, data)
        return success({"message": "Profile updated"})
    except Exception as e:
        return error(str(e), 500)
