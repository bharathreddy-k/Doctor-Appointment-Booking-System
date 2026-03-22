# System Architecture & Design

## Overview

Doctor Appointment Booking System is a full-stack web application designed with clean architecture principles, ensuring scalability, maintainability, and user-centric functionality.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                     │
├──────────────────────────┬──────────────────────────────────┤
│  Public Pages            │  Protected Pages (Doctor Only)   │
│  - Patient Booking Form  │  - Doctor Dashboard              │
│  - Doctor Login          │  - Appointment Details           │
│                          │  - Patient History View          │
└──────────────────┬───────┴──────────────────┬────────────────┘
                   │                          │
                   │  HTTP/CORS               │  JWT-Secured
                   │                          │
┌──────────────────▼──────────────────────────▼────────────────┐
│               API LAYER (Express.js)                          │
├────────────────────────────────────────────────────────────────┤
│  Routes:                                                       │
│  ├─ /api/doctors (login, register)                            │
│  └─ /api/appointments (book, view, update)                    │
│                                                                │
│  Middleware:                                                   │
│  ├─ Authentication (JWT verification)                         │
│  ├─ CORS                                                       │
│  └─ Error handling                                             │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │  Mongoose ODM
                   │
┌──────────────────▼───────────────────────────────────────────┐
│            DATABASE LAYER (MongoDB)                           │
├────────────────────────────────────────────────────────────────┤
│  Collections:                                                  │
│  ├─ doctors (id, email, passwordHash)                         │
│  ├─ patients (id, name, phoneNumber, age, gender, visits[])  │
│  └─ appointments (id, patient, date, timeSlot,                │
│                   visitDetails, isCompleted)                  │
└────────────────────────────────────────────────────────────────┘
```

## Data Models

### Doctor Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed with bcrypt),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model
```javascript
{
  _id: ObjectId,
  name: String,
  phoneNumber: String (unique, indexed),
  age: Number,
  gender: Enum['Male', 'Female', 'Other'],
  visits: [appointmentId],  // References to appointments
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  patient: {
    name: String,
    phoneNumber: String (indexed),
    age: Number,
    gender: String
  },
  date: Date (indexed),
  timeSlot: String (indexed),
  visitDetails: {
    height: String,
    weight: String,
    temperature: String,
    pulse: String,
    prescription: String
  },
  isCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Design

### Authentication Flow

```
POST /api/doctors/login
Request:  { email, password }
Response: { token, doctor: { id, email } }
Status:   200 (success) | 401 (invalid)
```

### Booking Flow

```
1. Check Available Slots
   GET /api/appointments/available-slots?date=YYYY-MM-DD
   Response: { date, availableSlots[], bookedSlots[] }

2. Book Appointment
   POST /api/appointments/book
   Request:  { patientName, phoneNumber, age, gender, date, timeSlot }
   Response: { appointment }
   Status:   201 (created) | 400 (slot taken)
```

### Doctor Dashboard Flow

```
1. Get All Appointments
   GET /api/appointments/all (protected)
   Response: [appointments]

2. Get Appointment Details + History
   GET /api/appointments/:id (protected)
   Response: { appointment, previousVisits[] }

3. Update Appointment with Medical Details
   PUT /api/appointments/:id (protected)
   Request:  { height, weight, temperature, pulse, prescription }
   Response: { updated appointment }
```

## Key Design Decisions

### 1. **Phone Number as Patient Identifier**
- **Why**: Simple, user-friendly, persistent across visits
- **Implementation**: Unique index on Patient.phoneNumber, and stored in Appointment
- **Benefit**: Easy to retrieve patient history without patient login

### 2. **Slot Blocking Strategy**
- **Why**: Prevent double-booking, simple business logic
- **Implementation**: Query existing appointments before creating new one
- **Database Query**:
  ```javascript
  Appointment.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
    timeSlot
  })
  ```
- **Benefit**: Real-time validation, prevents race conditions

### 3. **JWT Authentication**
- **Why**: Stateless, scalable, secure
- **Implementation**: Custom middleware, token stored in localStorage
- **Token Payload**: `{ id, email, iat, exp }`
- **Benefit**: Can scale to multiple servers, no session storage needed

### 4. **Separate Patient & Doctor Collections**
- **Why**: Different relationships and data
- **Patient**: Has multiple visits, identified by phone
- **Doctor**: Single account, manages all appointments
- **Benefit**: Clean separation of concerns, flexible scaling

### 5. **Rich Appointment Model**
- **Why**: Single model stores complete visit history
- **Data**: patient info, date, slot, medical details, completion status
- **Benefit**: No joins needed, efficient history lookup

### 6. **Protected Routes Pattern**
- **Client**: ProtectedRoute component checks authentication
- **Server**: authMiddleware verifies JWT token
- **Benefit**: Defense in depth, two-layer security

## Security Implementation

### Authentication & Authorization
```
Request Flow:
1. Client sends request with Authorization: Bearer <token>
2. authMiddleware extracts token
3. jwt.verify() validates token
4. Sets req.doctor = decoded payload
5. Route handler executes with authenticated context
6. Error: 401 Unauthorized → Redirect to login
```

### Password Security
```
Registration:
1. bcrypt.genSalt(10) generates salt
2. bcrypt.hash(password, salt) creates hash
3. Only hash stored in database

Login:
1. bcrypt.compare(password, storedHash)
2. Returns true/false
3. No plaintext password comparison
```

### Data Validation
- **Client-side**: HTML5 validation, React form validation
- **Server-side**: 
  - Required field validation
  - Type checking
  - Date validation (no past dates)
  - Enum validation (gender)

## Performance Optimizations

### Database Indexing
```javascript
// Patient.phoneNumber - Fast patient lookup by phone
// Appointment.date - Fast date range queries for slots
// Appointment.timeSlot - Combined index for slot availability
// Appointment['patient.phoneNumber'] - Fast history lookup
```

### Query Optimization
```javascript
// Get available slots - Single indexed query
// Get patient history - Indexed lookup by phoneNumber
// Get all appointments - Single query with sort
// Check slot availability - Single indexed query
```

### Frontend Optimization
- **API Integration**: Reusable axios instance with interceptors
- **Component Composition**: Separate components for reusability
- **State Management**: React hooks (useState, useEffect)
- **Lazy Loading**: Detail modals load on demand

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: No session affinity needed
- **Database**: MongoDB supports sharding
- **Load Balancer**: Can route to multiple backend instances
- **Frontend**: Easily deployable to CDN

### Vertical Scaling
- **Caching**: Could add Redis for frequently accessed data
- **Pagination**: Could paginate appointments list (currently all loaded)
- **Aggregation**: MongoDB aggregation pipeline for complex queries

### Future Enhancements
- Add appointment cancellation with slot recovery
- Implement rate limiting to prevent abuse
- Add audit logging for doctor actions
- Cache frequently accessed slots with TTL

## Error Handling Strategy

### Application-Level
```javascript
try-catch blocks in controllers
↓
Error message extraction
↓
HTTP status code mapping
↓
JSON response to client
```

### Network-Level
```javascript
Axios interceptors
↓
API error detection
↓
User-friendly message display
↓
Log for debugging
```

### User Experience
- Form validation before submission
- Clear error messages
- Success confirmation messages
- Loading states during async operations

## Testing Strategy

### Unit Testing (To be added)
- Doctor controller functions
- Appointment controller functions
- Validation logic
- Authentication logic

### Integration Testing (To be added)
- API endpoints
- Database interactions
- Authentication flow
- Booking workflow

### E2E Testing (Manual - covered in TESTING.md)
- Patient booking scenario
- Doctor login scenario
- Appointment management scenario
- Patient history scenario

## Deployment Architecture

### Development
```
Client: http://localhost:3000 (React Dev Server)
        ↓
Server: http://localhost:5000 (Express Dev Server)
        ↓
Database: MongoDB Atlas (Cloud)
```

### Production
```
Client: https://app.vercel.com (Vercel CDN)
        ↓ (HTTPS)
Server: https://api.vercel.com (Vercel Serverless)
        ↓ (Mongoose)
Database: MongoDB Atlas (Cloud)
```

## Code Organization

### Backend Structure
```
backend/
├── src/
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, error handling
│   └── server.js          # App entry point
```

**Benefits:**
- MVC pattern
- Clear separation of concerns
- Easy to locate functionality
- Scalable structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── services/          # API integration
│   ├── styles/            # CSS stylesheets
│   ├── App.jsx
│   └── index.jsx
```

**Benefits:**
- Component reusability
- Easy routing
- Clear API integration layer
- Organized styling

## Technology Choices

### Frontend: React
- **Why**: Component-based, large ecosystem, easy state management
- **Routing**: React Router for navigation
- **HTTP Client**: Axios for API calls
- **Styling**: Custom CSS with CSS variables

### Backend: Node.js/Express
- **Why**: JavaScript full-stack, fast, lightweight, great for I/O operations
- **Database**: Mongoose ODM for MongoDB
- **Authentication**: JWT + bcryptjs
- **Middleware**: CORS for cross-origin requests

### Database: MongoDB
- **Why**: Flexible schema, stores nested objects (patient in appointment), easy to scale
- **Hosted**: MongoDB Atlas (fully managed, free tier available)

## Future Architectural Improvements

1. **Microservices**: Separate user service, appointment service, notification service
2. **Message Queue**: RabbitMQ/Kafka for appointment notifications
3. **Caching Layer**: Redis for frequently accessed data
4. **GraphQL**: Alternative to REST for flexible querying
5. **WebSockets**: Real-time updates for appointment availability
6. **Search**: Elasticsearch for full-text search on prescriptions
7. **File Storage**: AWS S3 for medical document uploads

---

**This architecture balances simplicity with professional standards, making it ideal for portfolio and production use.**
