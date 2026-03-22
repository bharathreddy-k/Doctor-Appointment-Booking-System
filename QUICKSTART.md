# Quick Start Guide

Get the Doctor Appointment System running in 5 minutes!

## Prerequisites

- Node.js 14+ and npm installed
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)
- Any modern web browser

## Step 1: Get MongoDB Connection String

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a new cluster
4. Click "Connect" → "Drivers"
5. Copy your full Atlas URI (for example: `mongodb+srv://<your-uri-from-atlas>`)

## Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# Open .env and set:
# MONGODB_URI=your_mongodb_atlas_uri_here
# JWT_SECRET=your_secret_key_here (can be any random string)

# Install dependencies
npm install

# Start backend
npm run dev
```

**Backend will run on http://localhost:5000**

Test it: Open http://localhost:5000/api/health in browser

## Step 3: Setup Frontend

```bash
# In a new terminal, navigate to frontend
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start frontend
npm start
```

**Frontend will automatically open http://localhost:3000**

## Step 4: Test the Application

### As a Patient:
1. Fill in the booking form
2. Select a date and available time slot
3. Click "Book Appointment"
4. See success message

### As a Doctor:
1. Click "Doctor Login" in top navigation
2. Use demo credentials:
   - Email: `doctor@example.com`
   - Password: `password123`
3. View all patient appointments
4. Click any appointment card to view details

## 🎉 Done!

Your Doctor Appointment System is now running!

---

## Stopping the Servers

- **Backend**: Press `Ctrl+C` in backend terminal
- **Frontend**: Press `Ctrl+C` in frontend terminal

## Common Issues

### "Cannot connect to MongoDB"
- Check your connection string in `.env`
- Ensure IP whitelist in MongoDB Atlas includes your IP
- Verify internet connection

### "Port 5000 or 3000 already in use"
- Kill the process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

### "Blank page after npm start"
- Wait 30 seconds for React build
- Check browser console for errors (F12)
- Clear browser cache

---

## Next Steps

1. **Test all features** - Follow TESTING.md
2. **Customize credentials** - Change doctor email/password in `.env`
3. **Deploy** - Follow DEPLOYMENT.md for production

---

**Need help? Check README.md for detailed documentation**
