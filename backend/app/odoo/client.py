"""
Odoo XML-RPC base client.
All calls to Odoo go through this class.
"""
import xmlrpc.client
from flask import current_app


class OdooClient:
    def _connect(self):
        url = current_app.config["ODOO_URL"]
        common = xmlrpc.client.ServerProxy(
            f"{url}/xmlrpc/2/common",
            allow_none=True,
            use_datetime=True,
        )
        models = xmlrpc.client.ServerProxy(
            f"{url}/xmlrpc/2/object",
            allow_none=True,
            use_datetime=True,
        )
        return common, models

    def authenticate(self, username: str = None, password: str = None, persist: bool = False):
        # Keep this method stateless: global shared XML-RPC clients are not thread-safe.
        common, _ = self._connect()
        db = current_app.config["ODOO_DB"]
        usr = username or current_app.config["ODOO_USER"]
        pwd = password or current_app.config["ODOO_PASSWORD"]
        uid = common.authenticate(db, usr, pwd, {})
        if not uid:
            raise PermissionError("Odoo authentication failed")
        return uid

    def call(self, model: str, method: str, args: list, kwargs: dict = None):
        """Generic execute_kw call."""
        # Authenticate on each call with configured integration user.
        # This avoids shared mutable connection state between concurrent requests.
        _, models = self._connect()
        uid = self.authenticate()
        pwd = current_app.config["ODOO_PASSWORD"]
        db = current_app.config["ODOO_DB"]
        return models.execute_kw(
            db, uid, pwd, model, method, args, kwargs or {}
        )

    def search_read(self, model: str, domain: list, fields: list, limit: int = 100, offset: int = 0):
        return self.call(model, "search_read", [domain], {
            "fields": fields, "limit": limit, "offset": offset
        })

    def read(self, model: str, ids: list, fields: list):
        return self.call(model, "read", [ids], {"fields": fields})

    def create(self, model: str, values: dict):
        return self.call(model, "create", [values])

    def write(self, model: str, ids: list, values: dict):
        return self.call(model, "write", [ids, values])

    def unlink(self, model: str, ids: list):
        return self.call(model, "unlink", [ids])

    def search(self, model: str, domain: list):
        return self.call(model, "search", [domain])


odoo = OdooClient()
