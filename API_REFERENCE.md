# API Reference Guide

Complete documentation of all API endpoints with examples.

---

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-api-url.vercel.app/api`

---

## Authentication

### JWT Token Format

```
Authorization: Bearer <token>
```

### Getting a Token

**Endpoint**: `POST /doctors/login`

**Request**:
```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": {
    "id": "507f1f77bcf86cd799439011",
    "email": "doctor@example.com"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Invalid credentials"
}
```

---

## Doctor Endpoints

### Register Doctor

**Endpoint**: `POST /doctors/register`

**Request**:
```json
{
  "email": "newdoctor@example.com",
  "password": "securepassword123"
}
```

**Response** (201 Created):
```json
{
  "message": "Doctor registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": {
    "id": "507f1f77bcf86cd799439012",
    "email": "newdoctor@example.com"
  }
}
```

### Login Doctor

**Endpoint**: `POST /doctors/login`

**Description**: Authenticate doctor and get JWT token

**Request**:
```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": {
    "id": "507f1f77bcf86cd799439011",
    "email": "doctor@example.com"
  }
}
```

---

## Appointment Endpoints

### Get Available Slots

**Endpoint**: `GET /appointments/available-slots?date=2024-01-20`

**Description**: Get available time slots for a specific date

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| date | String (YYYY-MM-DD) | Yes | Date to check |

**Response** (200 OK):
```json
{
  "date": "2024-01-20",
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "bookedSlots": ["12:00", "16:00"]
}
```

**Example cURL**:
```bash
curl "http://localhost:5000/api/appointments/available-slots?date=2024-01-20"
```

**Example JavaScript**:
```javascript
fetch('http://localhost:5000/api/appointments/available-slots?date=2024-01-20')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

### Book Appointment

**Endpoint**: `POST /appointments/book`

**Description**: Book a new appointment (public endpoint)

**Request Body**:
```json
{
  "patientName": "John Doe",
  "phoneNumber": "9876543210",
  "age": 35,
  "gender": "Male",
  "date": "2024-01-20",
  "timeSlot": "09:00"
}
```

**Response** (201 Created):
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439013",
    "patient": {
      "name": "John Doe",
      "phoneNumber": "9876543210",
      "age": 35,
      "gender": "Male"
    },
    "date": "2024-01-20T00:00:00Z",
    "timeSlot": "09:00",
    "visitDetails": null,
    "isCompleted": false,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "This time slot is already booked"
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "phoneNumber": "9876543210",
    "age": 35,
    "gender": "Male",
    "date": "2024-01-20",
    "timeSlot": "09:00"
  }'
```

---

### Get All Appointments

**Endpoint**: `GET /appointments/all`

**Description**: Get all appointments (doctor only)

**Authentication**: Required (JWT Token)

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "patient": {
      "name": "John Doe",
      "phoneNumber": "9876543210",
      "age": 35,
      "gender": "Male"
    },
    "date": "2024-01-20T00:00:00Z",
    "timeSlot": "09:00",
    "visitDetails": null,
    "isCompleted": false,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "patient": {
      "name": "Jane Smith",
      "phoneNumber": "8765432109",
      "age": 28,
      "gender": "Female"
    },
    "date": "2024-01-20T00:00:00Z",
    "timeSlot": "10:00",
    "visitDetails": null,
    "isCompleted": false,
    "createdAt": "2024-01-15T10:05:00Z"
  }
]
```

**Example cURL**:
```bash
curl http://localhost:5000/api/appointments/all \
  -H "Authorization: Bearer your_token_here"
```

---

### Get Appointment Details

**Endpoint**: `GET /appointments/:id`

**Description**: Get specific appointment details with patient history

**Authentication**: Required (JWT Token)

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | String (ObjectId) | Yes | Appointment ID |

**Response** (200 OK):
```json
{
  "appointment": {
    "_id": "507f1f77bcf86cd799439013",
    "patient": {
      "name": "John Doe",
      "phoneNumber": "9876543210",
      "age": 35,
      "gender": "Male"
    },
    "date": "2024-01-20T00:00:00Z",
    "timeSlot": "09:00",
    "visitDetails": null,
    "isCompleted": false,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "previousVisits": [
    {
      "date": "2024-01-13T00:00:00Z",
      "timeSlot": "10:00",
      "prescription": "Take rest for 2 days",
      "details": {
        "height": "175",
        "weight": "75",
        "temperature": "98.6",
        "pulse": "72"
      }
    }
  ]
}
```

**Example cURL**:
```bash
curl http://localhost:5000/api/appointments/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer your_token_here"
```

---

### Update Appointment Details

**Endpoint**: `PUT /appointments/:id`

**Description**: Add examination details and prescription to appointment

**Authentication**: Required (JWT Token)

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | String (ObjectId) | Yes | Appointment ID |

**Request Body**:
```json
{
  "height": "175",
  "weight": "75",
  "temperature": "98.6",
  "pulse": "72",
  "prescription": "Take rest for 2 days. Drink plenty of water."
}
```

**Response** (200 OK):
```json
{
  "message": "Appointment details updated successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439013",
    "patient": {
      "name": "John Doe",
      "phoneNumber": "9876543210",
      "age": 35,
      "gender": "Male"
    },
    "date": "2024-01-20T00:00:00Z",
    "timeSlot": "09:00",
    "visitDetails": {
      "height": "175",
      "weight": "75",
      "temperature": "98.6",
      "pulse": "72",
      "prescription": "Take rest for 2 days. Drink plenty of water."
    },
    "isCompleted": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Appointment not found"
}
```

**Example cURL**:
```bash
curl -X PUT http://localhost:5000/api/appointments/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "height": "175",
    "weight": "75",
    "temperature": "98.6",
    "pulse": "72",
    "prescription": "Take rest for 2 days. Drink plenty of water."
  }'
```

---

### Get Patient History

**Endpoint**: `GET /appointments/patient-history/:phoneNumber`

**Description**: Get all appointments for a patient by phone number

**Authentication**: Required (JWT Token)

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| phoneNumber | String | Yes | Patient phone number |

**Response** (200 OK):
```json
{
  "phoneNumber": "9876543210",
  "visits": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "patient": {
        "name": "John Doe",
        "phoneNumber": "9876543210",
        "age": 35,
        "gender": "Male"
      },
      "date": "2024-01-20T00:00:00Z",
      "timeSlot": "10:00",
      "visitDetails": {
        "height": "175",
        "weight": "76",
        "temperature": "98.4",
        "pulse": "70",
        "prescription": "Continue previous medication"
      },
      "isCompleted": true,
      "createdAt": "2024-01-20T10:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "patient": {
        "name": "John Doe",
        "phoneNumber": "9876543210",
        "age": 35,
        "gender": "Male"
      },
      "date": "2024-01-13T00:00:00Z",
      "timeSlot": "09:00",
      "visitDetails": {
        "height": "175",
        "weight": "75",
        "temperature": "98.6",
        "pulse": "72",
        "prescription": "Take rest for 2 days"
      },
      "isCompleted": true,
      "createdAt": "2024-01-13T10:00:00Z"
    }
  ]
}
```

**Example cURL**:
```bash
curl http://localhost:5000/api/appointments/patient-history/9876543210 \
  -H "Authorization: Bearer your_token_here"
```

---

## Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Request successful |
| 201 | Created | Resource created (POST) |
| 400 | Bad Request | Invalid request or already booked |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Server error |

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

---

## Rate Limiting

Currently no rate limiting. For production, consider:
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per token for authenticated endpoints

---

## Pagination

Currently returns all results. For large datasets, consider using:
```
GET /appointments/all?page=1&limit=20
```

---

## Filtering

Consider adding filters in future:
```
GET /appointments/all?status=completed
GET /appointments/all?date=2024-01-20
```

---

## CORS

Frontend must be whitelisted in backend CORS configuration.

**Allowed Origins**:
- http://localhost:3000 (development)
- https://your-frontend.vercel.app (production)

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Store token in localStorage** on client
3. **Include token in all requests** via axios interceptor
4. **Handle 401 errors** by redirecting to login
5. **Validate dates** on client before sending
6. **Use consistent date format** (YYYY-MM-DD)

---

## Example: Complete Booking Flow with API

```javascript
// Step 1: Get available slots
const slotsResponse = await fetch('/api/appointments/available-slots?date=2024-01-20');
const { availableSlots } = await slotsResponse.json();

// Step 2: User selects a slot and books
const bookingResponse = await fetch('/api/appointments/book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientName: 'John Doe',
    phoneNumber: '9876543210',
    age: 35,
    gender: 'Male',
    date: '2024-01-20',
    timeSlot: availableSlots[0]
  })
});

// Step 3: Doctor logs in
const loginResponse = await fetch('/api/doctors/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'doctor@example.com',
    password: 'password123'
  })
});
const { token } = await loginResponse.json();

// Step 4: Doctor views all appointments
const appointmentsResponse = await fetch('/api/appointments/all', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const appointments = await appointmentsResponse.json();

// Step 5: Doctor adds examination details
const updateResponse = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    height: '175',
    weight: '75',
    temperature: '98.6',
    pulse: '72',
    prescription: 'Rest for 2 days'
  })
});
```

---

## Testing with Postman

1. Import the API endpoints
2. Set up a `base_url` variable for your API
3. Set up a `token` variable (obtained from login)
4. Use `{{base_url}}` and `{{token}}` in requests

---

**For more details, see [README.md](README.md) and [ARCHITECTURE.md](ARCHITECTURE.md)**
