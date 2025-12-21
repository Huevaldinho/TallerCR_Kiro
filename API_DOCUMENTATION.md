# Taller Pro CR - API Documentation

## Overview

The Taller Pro CR API provides a complete REST API for managing a workshop in Costa Rica, including vehicles, clients, service orders, and fiscal compliance with Costa Rican regulations (CABYS codes, 13% IVA).

## Interactive Documentation

**Swagger UI**: http://localhost:3000/api-docs

The interactive Swagger UI provides:
- Complete API reference with all endpoints
- Request/response schemas
- Try-it-out functionality to test endpoints directly
- Example requests and responses
- Authentication requirements (when implemented)

## OpenAPI Specification

**JSON Spec**: http://localhost:3000/api/docs

Download the OpenAPI 3.0 specification in JSON format for:
- Importing into Postman
- Generating client SDKs
- API testing tools
- Documentation generators

## Quick Start

### 1. Access Swagger UI

Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

### 2. Test Endpoints

All endpoints are ready to test. Click on any endpoint to:
- View request/response schemas
- See example payloads
- Execute requests directly from the browser

### 3. Common Workflows

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
```

#### List All Vehicles
```http
GET /api/vehiculos
```

#### Search Vehicles by License Plate
```http
GET /api/vehiculos?placa=ABC
```

#### Create a New Vehicle
```http
POST /api/vehiculos
Content-Type: application/json

{
  "placa": "ABC-123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "año": "2020",
  "color": "Blanco",
  "kilometraje": "45000"
}
```

#### List All Clients
```http
GET /api/clientes
```

#### Create a New Client
```http
POST /api/clientes
Content-Type: application/json

{
  "nombreCompleto": "María González",
  "tipoIdentificacion": "FISICA",
  "numeroIdentificacion": "1-1234-5678",
  "telefono": "+506 7777-7777",
  "email": "maria@email.com"
}
```

#### List All Orders
```http
GET /api/ordenes
```

#### Get Order Details
```http
GET /api/ordenes/{orderId}
```

#### Create a New Order
```http
POST /api/ordenes
Content-Type: application/json

{
  "vehicleId": "uuid-here",
  "clientId": "uuid-here",
  "motivoIngreso": "Mantenimiento preventivo",
  "lineItems": [
    {
      "descripcion": "Cambio de aceite de motor",
      "cabysCode": "8527101010000",
      "cantidad": 1,
      "precioUnitarioCentimos": 1500000
    }
  ]
}
```

#### Update Order Status
```http
PATCH /api/ordenes/{orderId}
Content-Type: application/json

{
  "status": "ENVIADA"
}
```

#### List Services Catalog
```http
GET /api/servicios
```

## API Endpoints Summary

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Vehicles
- `GET /api/vehiculos` - List all vehicles (supports search)
- `POST /api/vehiculos` - Create new vehicle

### Clients
- `GET /api/clientes` - List all clients
- `POST /api/clientes` - Create new client

### Orders
- `GET /api/ordenes` - List all orders
- `POST /api/ordenes` - Create new order
- `GET /api/ordenes/{id}` - Get order details
- `PATCH /api/ordenes/{id}` - Update order status

### Services
- `GET /api/servicios` - List services catalog

## Data Models

### Order Status Flow
```
BORRADOR → ENVIADA → APROBADA → FACTURADA → COMPLETADA
```

### Identification Types (Costa Rica)
- `FISICA` - Cédula Física (Personal ID)
- `JURIDICA` - Cédula Jurídica (Company ID)
- `DIMEX` - DIMEX (Foreign Resident ID)
- `NITE` - NITE (Tax ID for foreigners)
- `PASAPORTE` - Passport

### Monetary Values
All monetary values are stored as integers in **centimos** (cents):
- ₡15,000 = 1500000 centimos
- ₡1,950 (13% IVA) = 195000 centimos
- ₡16,950 (total) = 1695000 centimos

### CABYS Codes
All services use official Costa Rican CABYS codes (13-digit codes) for fiscal compliance.

## Testing with PowerShell

```powershell
# GET request
Invoke-RestMethod -Uri "http://localhost:3000/api/vehiculos" | ConvertTo-Json -Depth 3

# POST request
$body = '{"placa":"ABC-123","marca":"Toyota","modelo":"Corolla","año":"2020"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/vehiculos" -Method POST -Body $body -ContentType "application/json; charset=utf-8"

# PATCH request
$body = '{"status":"ENVIADA"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/ordenes/{id}" -Method PATCH -Body $body -ContentType "application/json; charset=utf-8"
```

## Testing with cURL (Linux/Mac)

```bash
# GET request
curl http://localhost:3000/api/vehiculos

# POST request
curl -X POST http://localhost:3000/api/vehiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"ABC-123","marca":"Toyota","modelo":"Corolla","año":"2020"}'

# PATCH request
curl -X PATCH http://localhost:3000/api/ordenes/{id} \
  -H "Content-Type: application/json" \
  -d '{"status":"ENVIADA"}'
```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, duplicate entry)
- `404` - Not Found
- `500` - Internal Server Error

## Features

✅ Complete OpenAPI 3.0 specification  
✅ Interactive Swagger UI  
✅ Request/response schemas  
✅ Example payloads  
✅ Try-it-out functionality  
✅ Costa Rica fiscal compliance (CABYS, IVA 13%)  
✅ Automatic IVA calculation  
✅ Order status tracking  
✅ Search functionality  

## Next Steps

1. **Explore the API**: Visit http://localhost:3000/api-docs
2. **Test Endpoints**: Use the "Try it out" button in Swagger UI
3. **Import to Postman**: Download the spec from http://localhost:3000/api/docs
4. **Generate Client SDK**: Use the OpenAPI spec with code generators

## Support

For questions or issues, refer to:
- Swagger UI: http://localhost:3000/api-docs
- API Test Results: `API_TEST_RESULTS.md`
- Development Workflow: `.kiro/steering/development-workflow.md`
