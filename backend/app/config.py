import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY       = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG            = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # Odoo
    ODOO_URL         = os.getenv("ODOO_URL", "http://localhost:8069")
    ODOO_DB          = os.getenv("ODOO_DB", "catalogix")
    ODOO_USER        = os.getenv("ODOO_USER", "admin")
    ODOO_PASSWORD    = os.getenv("ODOO_PASSWORD", "admin")

    # CORS
    CORS_ORIGINS     = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    # JWT
    JWT_SECRET       = os.getenv("JWT_SECRET", "jwt-secret-key")
    JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))
    JWT_REFRESH_DAYS = int(os.getenv("JWT_REFRESH_DAYS", "30"))
    RESET_TOKEN_MINUTES = int(os.getenv("RESET_TOKEN_MINUTES", "30"))
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    SEND_RESET_EMAIL = os.getenv("SEND_RESET_EMAIL", "false").lower() == "true"
    RESET_EMAIL_FROM = os.getenv("RESET_EMAIL_FROM", "no-reply@catalogix.local")
