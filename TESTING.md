# Testing Guide - Doctor Appointment Booking System

## Complete Test Scenarios

### Scenario 1: Patient Books First Appointment

**steps:**
1. Open application home page
2. Fill booking form:
   - Name: John Doe
   - Phone: 9876543210
   - Age: 35
   - Gender: Male
   - Date: Tomorrow's date
   - Time: Select any available slot (e.g., 09:00)
3. Click "Book Appointment"

**Expected Result:**
- Success message appears
- Form clears
- Selected time slot is no longer available
- Other slots remain available

---

### Scenario 2: Slot Blocking Test

**Steps:**
1. Complete Scenario 1 (book slot 09:00 on a date)
2. Go back to home page
3. Select the same date again
4. Check available slots

**Expected Result:**
- Previously booked 09:00 slot should NOT appear in available slots
- Other slots remain available
- Booked slots message shows "09:00" as taken

---

### Scenario 3: Doctor Login

**Steps:**
1. Click "Doctor Login" in navigation
2. Enter:
   - Email: doctor@example.com
   - Password: password123
3. Click "Login"

**Expected Result:**
- Login successful message
- Redirected to /dashboard
- Doctor can see appointments list

---

### Scenario 4: View Appointment Details

**Steps:**
1. Login as doctor (Scenario 3)
2. In dashboard, click on any appointment card
3. Modal opens with patient details

**Expected Result:**
- Modal shows:
  - Patient name, phone, age, gender
  - Appointment date and time
  - Empty examination form
  - No previous visits (first booking)

---

### Scenario 5: Add Examination Details

**Steps:**
1. Complete Scenario 4 (open appointment modal)
2. Fill examination details:
   - Height: 175 cm
   - Weight: 75 kg
   - Temperature: 98.6°C
   - Pulse: 72 bpm
   - Prescription: Take rest for 2 days
3. Click "Save Details"

**Expected Result:**
- Success message appears
- Appointment marked as "Completed"
- Modal closes
- Card shows updated status

---

### Scenario 6: Patient History Retrieval

**Steps:**
1. Book appointment with phone: 9876543210 (Scenario 1)
2. Complete examination (Scenario 5)
3. Book another appointment with SAME phone: 9876543210
4. Doctor opens the new appointment card
5. View the modal

**Expected Result:**
- Patient found (same phone)
- Modal shows current appointment form
- **Previous Visit History section displays:**
  - Previous visit date and time
  - Previous prescription
  - Previous vital signs (height, weight, etc.)

---

### Scenario 7: Multiple Patients Same Day

**Steps:**
1. Book appointment for patient A: Phone 1111111111, slot 10:00
2. Book appointment for patient B: Phone 2222222222, slot 10:00
3. Login as doctor
4. Check dashboard

**Expected Result:**
- Both appointments should NOT exist (same slot)
- Error on second booking: "This time slot is already booked"
- Only first booking succeeds

---

### Scenario 8: Session Persistence

**Steps:**
1. Login as doctor
2. Close browser completely
3. Reopen application
4. Navigate to /dashboard

**Expected Result:**
- Token stored in localStorage
- Should still access dashboard without login
- Logout clears token
- Trying to access /dashboard redirects to login

---

### Scenario 9: Protected Route Test

**Steps:**
1. Clear localStorage (remove doctorToken)
2. Try to access /dashboard directly

**Expected Result:**
- Redirected to /doctor-login
- Cannot access dashboard without token

---

### Scenario 10: Error Handling

**Steps:**
1. Test incomplete form submission:
   - Leave "Name" field empty
   - Click Book
2. Test invalid date:
   - Try to select a past date

**Expected Result:**
- Error message: "All fields are required"
- Date picker prevents past dates
- Form doesn't submit with errors

---

## API Testing with cURL

### Test Available Slots
```bash
curl "http://localhost:5000/api/appointments/available-slots?date=2024-01-15"
```

### Test Booking
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "phoneNumber": "9876543210",
    "age": 35,
    "gender": "Male",
    "date": "2024-01-15",
    "timeSlot": "09:00"
  }'
```

### Test Doctor Login
```bash
curl -X POST http://localhost:5000/api/doctors/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "password123"
  }'
```

### Test Get All Appointments (protected)
```bash
curl http://localhost:5000/api/appointments/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Get Patient History
```bash
curl http://localhost:5000/api/appointments/patient-history/9876543210 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Performance Testing

### Load Testing Checklist
- [ ] Can handle multiple simultaneous bookings
- [ ] Slot availability updates in real-time
- [ ] Appointment details load within 2 seconds
- [ ] Dashboard loads with 500+ appointments
- [ ] Previous visits load quickly for patient with multiple visits

### Database Query Performance
- [ ] Available slots query completes in < 100ms
- [ ] Patient history query completes in < 200ms
- [ ] All appointments query completes in < 300ms

---

## Security Testing

### Test Checklist
- [ ] Cannot access dashboard without token
- [ ] Invalid token rejected
- [ ] Expired token handled
- [ ] SQL injection attempts blocked (using MongoDB)
- [ ] XSS prevention (React escaping)
- [ ] CORS only allows configured frontend
- [ ] Passwords properly hashed (bcrypt)

---

## Cross-Browser Testing

### Test on Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Responsive Design
- [ ] Desktop (1920px width)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)

---

## Accessibility Testing

- [ ] All form inputs have labels
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## Data Validation Tests

### Phone Number
- [ ] Accepts various formats
- [ ] Stores correctly
- [ ] Acts as unique identifier

### Date & Time
- [ ] Past dates rejected
- [ ] Invalid dates handled
- [ ] Time slots properly formatted

### Medical Details
- [ ] Text areas accept long text
- [ ] Numbers validated for vitals
- [ ] Special characters in prescription allowed

---

## End-to-End Workflow Test

**Complete workflow from patient booking to doctor review:**

1. Patient books appointment (Scenario 1)
2. Patient books second appointment with same phone (Scenario 1)
3. Doctor logs in (Scenario 3)
4. Doctor views first appointment and adds examination details (Scenario 5)
5. Doctor views second appointment and sees patient history (Scenario 6)
6. Verify prescription from first visit shows in second appointment
7. Doctor adds new examination and prescription to second appointment
8. Verify system correctly tracks both visits

---

## Test Data

### Patient Test Accounts
```
Patient 1:
  Name: John Doe
  Phone: 9876543210
  Age: 35
  Gender: Male

Patient 2:
  Name: Jane Smith
  Phone: 8765432109
  Age: 28
  Gender: Female

Patient 3:
  Name: Robert Johnson
  Phone: 7654321098
  Age: 45
  Gender: Male
```

### Doctor Account
```
Email: doctor@example.com
Password: password123
```

---

## Bug Report Template

If you find issues during testing:

```
Title: [Brief description]

Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Environment:
- Browser: Chrome v120
- OS: Windows 10
- URL: http://localhost:3000

Screenshots:
[Attach if possible]
```

---

## Test Results Log

| Test Case | Status | Notes | Date |
|-----------|--------|-------|------|
| Scenario 1: First Booking | ✓ PASS | - | 2024-01-15 |
| Scenario 2: Slot Blocking | ✓ PASS | - | 2024-01-15 |
| Scenario 3: Doctor Login | ✓ PASS | - | 2024-01-15 |
| ... | ... | ... | ... |

---

**All critical scenarios should pass before deployment!**
