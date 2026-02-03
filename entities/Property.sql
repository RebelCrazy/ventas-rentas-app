{
  "name": "Property",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "T\u00edtulo de la propiedad"
    },
    "description": {
      "type": "string",
      "description": "Descripci\u00f3n detallada"
    },
    "type": {
      "type": "string",
      "enum": [
        "casa",
        "apartamento",
        "terreno",
        "oficina",
        "local_comercial",
        "bodega"
      ],
      "description": "Tipo de propiedad"
    },
    "operation": {
      "type": "string",
      "enum": [
        "venta",
        "alquiler"
      ],
      "description": "Tipo de operaci\u00f3n"
    },
    "price": {
      "type": "number",
      "description": "Precio de la propiedad"
    },
    "currency": {
      "type": "string",
      "enum": [
        "USD",
        "EUR",
        "MXN"
      ],
      "default": "USD"
    },
    "area": {
      "type": "number",
      "description": "\u00c1rea en metros cuadrados"
    },
    "bedrooms": {
      "type": "number",
      "description": "N\u00famero de habitaciones"
    },
    "bathrooms": {
      "type": "number",
      "description": "N\u00famero de ba\u00f1os"
    },
    "parking": {
      "type": "number",
      "description": "Espacios de estacionamiento"
    },
    "address": {
      "type": "string",
      "description": "Direcci\u00f3n"
    },
    "city": {
      "type": "string",
      "description": "Ciudad"
    },
    "neighborhood": {
      "type": "string",
      "description": "Colonia o barrio"
    },
    "images": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "URLs de im\u00e1genes"
    },
    "features": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Caracter\u00edsticas adicionales"
    },
    "status": {
      "type": "string",
      "enum": [
        "disponible",
        "reservada",
        "vendida",
        "alquilada"
      ],
      "default": "disponible"
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "description": "Propiedad destacada"
    }
  },
  "required": [
    "title",
    "type",
    "operation",
    "price",
    "city"
  ]
}