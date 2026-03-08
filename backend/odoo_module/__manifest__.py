{
    "name":        "Catalogix Digital",
    "version":     "17.0.1.0.0",
    "summary":     "Módulo de catálogo digital para Catalogix",
    "author":      "Catalogix",
    "category":    "Sales/Catalog",
    "depends":     ["base", "sale", "product", "website"],
    "data": [
        "security/ir.model.access.csv",
        "views/catalog_views.xml",
        "data/catalog_data.xml",
    ],
    "installable": True,
    "auto_install": False,
    "application":  True,
}
