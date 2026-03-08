from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, origins=app.config["CORS_ORIGINS"])

    # ── Blueprints ────────────────────────────────────────────────────────────
    from .api.auth     import bp as auth_bp
    from .api.catalogs import bp as catalogs_bp
    from .api.products import bp as products_bp
    from .api.orders   import bp as orders_bp
    from .api.payments import bp as payments_bp
    from .api.users    import bp as users_bp
    from .api.vendor_coupons import bp as vendor_coupons_bp
    from .api.vendor_invoices import bp as vendor_invoices_bp

    app.register_blueprint(auth_bp,     url_prefix="/api/auth")
    app.register_blueprint(catalogs_bp, url_prefix="/api/catalogs")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(orders_bp,   url_prefix="/api/orders")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    app.register_blueprint(users_bp,    url_prefix="/api/users")
    app.register_blueprint(vendor_coupons_bp, url_prefix="/api/vendor/coupons")
    app.register_blueprint(vendor_invoices_bp, url_prefix="/api/vendor/invoices")

    return app
