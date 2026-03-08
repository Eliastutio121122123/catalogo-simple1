import datetime
import jwt
import re
from flask import Blueprint, current_app, request
from ..odoo.client import odoo

from ..odoo.auth import login as odoo_login
from ..odoo.users import (
    UserAlreadyExistsError,
    create_user,
    get_user_by_email,
    get_user_by_id,
    normalize_email,
    update_user,
)
from ..utils.response import error, success
from ..utils.validators import require_fields

bp = Blueprint("auth", __name__)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def issue_jwt(uid: int) -> str:
    return jwt.encode({
        "uid": uid,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(
            hours=current_app.config["JWT_EXPIRY_HOURS"]
        ),
    }, current_app.config["JWT_SECRET"], algorithm="HS256")


def issue_purpose_token(uid: int, purpose: str, minutes: int = 30) -> str:
    return jwt.encode({
        "uid": uid,
        "purpose": purpose,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=minutes),
    }, current_app.config["JWT_SECRET"], algorithm="HS256")


def decode_token(token: str) -> dict:
    return jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=["HS256"])


def parse_reset_token(token: str) -> tuple[int, dict]:
    payload = decode_token(token)
    if payload.get("purpose") != "reset_password":
        raise jwt.InvalidTokenError("Invalid reset token purpose")
    uid = payload.get("uid")
    if not uid:
        raise jwt.InvalidTokenError("Invalid reset token payload")
    return int(uid), payload


def send_reset_email(email_to: str, name: str, reset_url: str) -> bool:
    mail_id = odoo.create("mail.mail", {
        "subject": "Catalogix - Restablecer contrasena",
        "email_to": email_to,
        "email_from": current_app.config["RESET_EMAIL_FROM"],
        "body_html": (
            f"<p>Hola {name or 'usuario'},</p>"
            "<p>Recibimos una solicitud para restablecer tu contrasena.</p>"
            f"<p><a href='{reset_url}'>Haz clic aqui para cambiarla</a></p>"
            "<p>Si no solicitaste este cambio, ignora este mensaje.</p>"
        ),
    })
    # Attempt immediate send; Odoo mail queue can also process this later.
    odoo.call("mail.mail", "send", [[mail_id]])
    return True


@bp.post("/login")
def login():
    data = request.get_json() or {}
    err = require_fields(data, ["email", "password"])
    if err:
        return error(err, 400)

    email = normalize_email(data["email"])
    password = str(data["password"])
    if not EMAIL_REGEX.match(email):
        return error("Invalid email format", 400)

    try:
        result = odoo_login(email, password)
        token = issue_jwt(result["uid"])
        return success({"token": token, "user": result["user"]})
    except PermissionError:
        return error("Invalid email or password", 401)
    except LookupError as exc:
        return error(str(exc), 404)


@bp.post("/register")
def register():
    data = request.get_json() or {}
    err = require_fields(data, ["name", "email", "password"])
    if err:
        return error(err, 400)

    name = str(data["name"]).strip()
    email = normalize_email(data["email"])
    password = str(data["password"])
    role = str(data.get("role") or "customer").strip().lower()
    phone = str(data.get("phone") or "").strip() or None
    company = str(data.get("company") or "").strip() or None

    if len(name) < 2:
        return error("Name must have at least 2 characters", 400)
    if not EMAIL_REGEX.match(email):
        return error("Invalid email format", 400)
    if len(password) < 8:
        return error("Password must have at least 8 characters", 400)
    if role not in {"customer", "vendor"}:
        return error("Invalid role. Allowed: customer, vendor", 400)

    try:
        uid = create_user(name, email, password, role=role, phone=phone, company=company)
        user = get_user_by_id(uid)
        return success({"uid": uid, "user": user}, 201)
    except UserAlreadyExistsError as exc:
        return error(str(exc), 409)
    except PermissionError as exc:
        return error(str(exc), 403)
    except Exception as exc:
        return error(str(exc), 500)


@bp.post("/logout")
def logout():
    # JWT is stateless: logout is handled on the client by deleting token.
    return success({"message": "Logged out"})


@bp.post("/forgot-password")
def forgot_password():
    data = request.get_json() or {}
    err = require_fields(data, ["email"])
    if err:
        return error(err, 400)

    email = normalize_email(data["email"])
    if not EMAIL_REGEX.match(email):
        return error("Invalid email format", 400)

    user = get_user_by_email(email)
    # Do not leak whether an email exists in the system.
    if not user:
        return success({"message": "If the account exists, password reset instructions were generated."})

    reset_minutes = current_app.config["RESET_TOKEN_MINUTES"]
    reset_token = issue_purpose_token(user["id"], "reset_password", minutes=reset_minutes)
    reset_url = f"{current_app.config['FRONTEND_URL']}/reset-password?token={reset_token}"
    payload = {
        "message": "Password reset token generated",
        "expires_in_minutes": reset_minutes,
        "email_sent": False,
    }

    if current_app.config["SEND_RESET_EMAIL"]:
        try:
            payload["email_sent"] = send_reset_email(email, user.get("name"), reset_url)
            payload["message"] = "Password reset email sent"
        except Exception as exc:
            payload["email_sent"] = False
            if current_app.config["DEBUG"]:
                payload["email_error"] = str(exc)

    if current_app.config["DEBUG"]:
        # In dev mode we return token/link directly; in production this should be emailed.
        payload["token"] = reset_token
        payload["reset_url"] = reset_url
    return success(payload)


@bp.post("/validate-reset-token")
def validate_reset_token():
    data = request.get_json() or {}
    err = require_fields(data, ["token"])
    if err:
        return error(err, 400)

    try:
        uid, _ = parse_reset_token(str(data["token"]))
        user = get_user_by_id(uid)
        return success({
            "valid": True,
            "uid": uid,
            "email": user.get("email"),
            "name": user.get("name"),
        })
    except jwt.ExpiredSignatureError:
        return error("Reset token expired", 401)
    except jwt.InvalidTokenError:
        return error("Invalid reset token", 401)
    except LookupError as exc:
        return error(str(exc), 404)


@bp.post("/reset-password")
def reset_password():
    data = request.get_json() or {}
    err = require_fields(data, ["token", "password"])
    if err:
        return error(err, 400)

    password = str(data["password"])
    if len(password) < 8:
        return error("Password must have at least 8 characters", 400)

    try:
        uid, _ = parse_reset_token(str(data["token"]))
    except jwt.ExpiredSignatureError:
        return error("Reset token expired", 401)
    except jwt.InvalidTokenError:
        return error("Invalid reset token", 401)

    update_user(uid, {"password": password})
    return success({"message": "Password updated successfully"})


@bp.post("/verify-email")
def verify_email():
    data = request.get_json() or {}
    err = require_fields(data, ["code"])
    if err:
        return error(err, 400)

    try:
        payload = decode_token(str(data["code"]))
    except jwt.ExpiredSignatureError:
        return error("Verification token expired", 401)
    except jwt.InvalidTokenError:
        return error("Invalid verification token", 401)

    if payload.get("purpose") != "verify_email":
        return error("Invalid verification token purpose", 401)

    uid = payload.get("uid")
    if not uid:
        return error("Invalid verification token payload", 401)

    user = get_user_by_id(int(uid))
    return success({"message": "Email verified", "user": user})
