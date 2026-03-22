# Doctor Appointment Booking System

A full-stack web application that allows patients to book doctor appointments and enables doctors to manage patient visits with medical records and prescription history.

## Features

### Patient Features
- **Easy Appointment Booking**: Simple form with patient details (name, phone, age, gender)
- **Smart Slot Selection**: Only available slots for selected date are shown
- **No Double-Booking**: Once a slot is booked, it's marked as unavailable
- **Patient Identification**: Phone number is the unique identifier for returning patients

### Doctor Features
- **Secure Login**: Email/password authentication with JWT tokens
- **Admin Dashboard**: View all booked appointments as cards
- **Patient Examination**: Add medical examination details (height, weight, temperature, pulse)
- **Prescription Management**: Add and view prescriptions for each visit
- **Patient History**: Automatically shows previous visit records and prescriptions for returning patients

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Styling**: Custom CSS with responsive design

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Doctor.js    # Doctor authentication
│   │   │   ├── Patient.js   # Patient records
│   │   │   └── Appointment.js  # Appointment/visit data
│   │   ├── routes/          # API endpoints
│   │   │   ├── doctorRoutes.js
│   │   │   └── appointmentRoutes.js
│   │   ├── controllers/     # Business logic
│   │   │   ├── doctorController.js
│   │   │   └── appointmentController.js
│   │   ├── middleware/      # Auth & error handling
│   │   └── server.js        # Express app
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── BookingForm.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── DoctorLogin.jsx
│   │   │   └── DoctorDashboard.jsx
│   │   ├── services/        # API integration
│   │   │   └── api.js
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Atlas or local)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB**
   - Update `MONGODB_URI` in `.env` with your MongoDB connection string
   - Get free MongoDB at https://www.mongodb.com/cloud/atlas

5. **Set JWT Secret**
   ```
   JWT_SECRET=your_secret_key_here_change_in_production
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   App opens on `http://localhost:3000`

## API Endpoints

### Doctor Routes
- `POST /api/doctors/login` - Doctor login
- `POST /api/doctors/register` - Doctor registration

### Appointment Routes
- `GET /api/appointments/available-slots?date=YYYY-MM-DD` - Get available time slots
- `POST /api/appointments/book` - Book a new appointment
- `GET /api/appointments/all` - Get all appointments (protected)
- `GET /api/appointments/:id` - Get appointment details with history (protected)
- `PUT /api/appointments/:id` - Update appointment with medical details (protected)
- `GET /api/appointments/patient-history/:phoneNumber` - Get patient visit history (protected)

## Available Time Slots

The system offers these time slots daily:
- 09:00, 10:00, 11:00, 12:00, 14:00, 15:00, 16:00, 17:00

## Demo Login Credentials

```
Email: doctor@example.com
Password: password123
```

## Usage

### For Patients
1. Go to home page (`/`)
2. Fill in appointment booking form
3. Select preferred date and available time slot
4. Click "Book Appointment" to confirm
5. Appointment is confirmed and spot becomes unavailable

### For Doctors
1. Go to `/doctor-login`
2. Enter email and password
3. View all scheduled appointments in dashboard
4. Click on any appointment card to view patient details
5. Add patient medical examination details and prescription
6. View previous visit history for the patient automatically

## Key Features Explained

### Slot Blocking Logic
- When a patient books a slot, it's immediately marked as unavailable
- System checks for existing appointments before confirmation
- Only unbooked slots are shown in the selection UI

### Patient History Tracking
- Patients are identified by phone number
- All previous visits with same phone number are retrieved
- Previous prescriptions are displayed when doctor opens patient card
- Helps doctor provide continuity of care

### Secure Doctor Access
- Only authenticated doctors can access the dashboard
- JWT tokens stored in browser's localStorage
- Token automatically included in API requests
- Invalid/expired tokens redirect to login page

## Deployment

### Deploy Backend (Heroku/Railway)

1. **Prepare for deployment**
   ```bash
   # Update MongoDB URI to production
   # Update JWT_SECRET to strong random key
   # Update FRONTEND_URL to deployed frontend URL
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create app-name
   heroku config:set MONGODB_URI=your_production_uri
   heroku config:set JWT_SECRET=your_strong_secret
   git push heroku main
   ```

### Deploy Frontend

1. **Build for production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

3. **Update environment variables**
   - Set `REACT_APP_API_URL` to your deployed backend URL

## Error Handling

The application includes comprehensive error handling:
- Invalid form submissions show user-friendly messages
- API errors are caught and displayed
- Date validation prevents past date bookings
- Duplicate slot booking prevention
- Authentication errors redirect to login

## Security Measures

- Passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- CORS protection on backend
- Input validation on both client and server
- Protected routes for doctor dashboard
- No sensitive data in localStorage (only token)

## Testing the Application

1. **Book an appointment**
   - Go to home page
   - Fill in details
   - Select a date and available slot
   - Slot should disappear after booking

2. **Test doctor dashboard**
   - Login with demo credentials
   - Should see booked appointments
   - Click on appointment to edit
   - Add examination details and prescription
   - Prescription should save successfully

3. **Test patient history**
   - Book another appointment with same phone number
   - Doctor opens this second appointment
   - Previous prescriptions should display

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of appointment details
- Optimized database indexes on date and time slot
- Efficient patient history retrieval by phone number
- Minimal re-renders in React components

## Future Enhancements

- Email notifications for bookings
- SMS appointment reminders
- Multiple doctor support with specialization
- Appointment cancellation system
- Rating and review system
- Payment integration
- Calendar view for appointments
- PDF prescription generation
- Telemedicine support

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB URI is correct in .env
- Check if MongoDB Atlas IP whitelist includes your IP
- Verify internet connection

### CORS Error
- Ensure `FRONTEND_URL` in backend .env matches your frontend URL
- Check if backend and frontend are on different ports

### API Not Responding
- Verify backend server is running
- Check `REACT_APP_API_URL` in frontend .env
- Ensure backend port is accessible

## License

MIT License - Feel free to use this project for commercial and personal purposes.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Built with ❤️ | Doctor Appointment Booking System**
