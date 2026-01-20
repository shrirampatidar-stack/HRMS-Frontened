# HRMS Lite - Complete Frontend Reference

## 🎯 Purpose
This document serves as a complete reference for the frontend implementation. When you provide the backend folder, I will use this to create a Spring Boot backend that perfectly matches the frontend requirements.

---

## 📋 API Endpoints Required

### Employee Endpoints

1. **GET /api/employees**
   - Returns: Array of all employees
   - Response: `[{ _id, employeeId, fullName, email, department, createdAt, updatedAt }]`

2. **GET /api/employees/:id**
   - Returns: Single employee by employeeId
   - Response: `{ _id, employeeId, fullName, email, department }`
   - Error: 404 if not found

3. **POST /api/employees**
   - Body: `{ employeeId, fullName, email, department }`
   - Validations:
     - All fields required
     - employeeId: unique
     - email: valid format, unique
     - fullName: min 2 characters
   - Response: Created employee (201)
   - Errors: 400 (validation), 409 (duplicate)

4. **DELETE /api/employees/:id**
   - Deletes employee by employeeId
   - Also deletes all attendance records for this employee
   - Response: `{ message, employee }`
   - Error: 404 if not found

### Attendance Endpoints

1. **POST /api/attendance**
   - Body: `{ employeeId, date (YYYY-MM-DD), status ("Present" | "Absent") }`
   - Validations:
     - All fields required
     - employeeId must exist
     - status must be "Present" or "Absent"
     - date must be valid
   - Behavior: If attendance exists for same employee+date, UPDATE it
   - Response: `{ message, attendance }`
   - Errors: 400 (validation), 404 (employee not found)

2. **GET /api/attendance/:employeeId**
   - Returns: Array of attendance records for employee
   - Response: `[{ _id, employeeId, date, status, createdAt, updatedAt }]`
   - Sorted by date descending
   - Error: 404 if employee not found

3. **GET /api/attendance/date/:date**
   - Returns: Array of attendance records for specific date
   - Date format: YYYY-MM-DD
   - Response: `[{ _id, employeeId, date, status }]`
   - Sorted by createdAt descending

### Health Check

1. **GET /api/health**
   - Returns: `{ status: "OK", message: "HRMS Lite API is running" }`

---

## 📊 Data Models

### Employee
```json
{
  "_id": "string (UUID or MongoDB ObjectId)",
  "employeeId": "string (unique, indexed, required)",
  "fullName": "string (required, min 2 chars)",
  "email": "string (required, unique, valid email, lowercase)",
  "department": "string (required)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Constraints:**
- employeeId: UNIQUE, indexed
- email: UNIQUE, indexed, lowercase
- Indexes on: employeeId, email

### Attendance
```json
{
  "_id": "string (UUID or MongoDB ObjectId)",
  "employeeId": "string (required, indexed, references Employee)",
  "date": "ISO date string (required, indexed, normalized to 00:00:00)",
  "status": "string (required, enum: ['Present', 'Absent'])",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Constraints:**
- Unique constraint on (employeeId, date) - one record per employee per day
- Date normalized to start of day (00:00:00)
- Indexes on: employeeId, date, (employeeId, date) composite

---

## 🎨 Frontend Pages & Features

### 1. Dashboard (`/`)

**Displays:**
- Total Employees count (stat card)
- Present Today count (stat card)
- Absent Today count (stat card)
- Recent Attendance table (last 5 records)

**API Calls:**
- GET /api/employees (for total count)
- GET /api/attendance/date/:today (for today's attendance)
- If date endpoint fails, fetches attendance for first 5 employees and filters

**UI Components:**
- StatCard components with gradients
- Table with recent attendance
- Empty state if no data
- Loading spinner

---

### 2. Employees Page (`/employees`)

**Features:**
- **Add Employee Modal:**
  - Form with: Employee ID, Full Name, Email, Department
  - Client-side validation
  - Submit: POST /api/employees
  - Success: Toast notification, refresh list, close modal
  - Error: Toast with error message

- **Employee List Table:**
  - Columns: Employee ID, Full Name, Email, Department, Actions
  - Delete button for each employee
  - Empty state if no employees

- **Delete Confirmation Modal:**
  - Shows employee name
  - Warning about cascade delete
  - Confirm: DELETE /api/employees/:id
  - Success: Toast, refresh list

**API Calls:**
- GET /api/employees (on load)
- POST /api/employees (on form submit)
- DELETE /api/employees/:id (on delete confirm)

**Validation:**
- Client: Real-time field validation
- Server: Required fields, email format, duplicates

---

### 3. Attendance Page (`/attendance`)

**Features:**
- **Mark Attendance Form:**
  - Employee dropdown (from GET /api/employees)
  - Date picker (max: today)
  - Status dropdown (Present/Absent)
  - Submit: POST /api/attendance
  - Success: Toast, refresh records, reset form

- **Attendance Records:**
  - Shows selected employee info card
  - Displays total present days
  - Table with date and status
  - Date filter input
  - Empty states for different scenarios

**API Calls:**
- GET /api/employees (for dropdown)
- POST /api/attendance (on form submit)
- GET /api/attendance/:employeeId (when employee selected)

**Features:**
- Real-time date filtering (client-side)
- Total present days calculation (client-side)
- Employee info display

---

## 🔧 Technical Details

### API Configuration
- Base URL: `http://localhost:8080/api` (dev)
- Environment variable: `VITE_API_URL`
- Headers: `Content-Type: application/json`
- Error interceptor handles connection errors

### CORS Requirements
Backend must allow:
- Origin: Frontend URL (localhost:5173 for dev, production URL for prod)
- Methods: GET, POST, DELETE
- Headers: Content-Type, Authorization (if needed)

### Error Response Format
```json
{
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Success Response Format
- 201 for POST (created)
- 200 for GET, DELETE
- Include full object in response

---

## ✅ Validation Rules

### Employee
- **employeeId**: 
  - Required
  - Unique (check before insert)
  - String type
  
- **fullName**: 
  - Required
  - Minimum 2 characters
  - String type
  
- **email**: 
  - Required
  - Valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
  - Unique (check before insert)
  - Convert to lowercase
  
- **department**: 
  - Required
  - String type

### Attendance
- **employeeId**: 
  - Required
  - Must exist in Employee collection
  
- **date**: 
  - Required
  - Valid date format (ISO 8601 or YYYY-MM-DD)
  - Normalize to start of day (00:00:00)
  - Cannot be future date (frontend enforces, backend should validate)
  
- **status**: 
  - Required
  - Enum: ["Present", "Absent"]
  - Case-sensitive

---

## 🗄️ Database Requirements

### Indexes Needed

**Employee Collection:**
- Index on `employeeId` (unique)
- Index on `email` (unique)
- Index on `_id` (default)

**Attendance Collection:**
- Index on `employeeId`
- Index on `date`
- Composite unique index on (`employeeId`, `date`)
- Index on `_id` (default)

### Cascade Operations
- When employee is deleted, delete all attendance records with matching employeeId
- This is expected by frontend (no separate cleanup needed)

### Date Handling
- Store dates normalized to start of day (00:00:00)
- Use consistent timezone (UTC recommended)
- Return dates in ISO 8601 format

---

## 🎯 Key Implementation Notes

1. **Attendance Update Logic:**
   - Check if attendance exists for (employeeId, date)
   - If exists: UPDATE status
   - If not: CREATE new record
   - Return appropriate message

2. **Employee ID Usage:**
   - Used as identifier in URLs (`/api/employees/:id`)
   - NOT the database `_id`
   - Must be unique across all employees

3. **Date Filtering:**
   - Frontend filters by date client-side
   - Backend provides all records for employee
   - Date format: YYYY-MM-DD or ISO 8601

4. **Error Messages:**
   - Should be user-friendly
   - Include field names for validation errors
   - Use proper HTTP status codes

5. **Response Consistency:**
   - Always return JSON
   - Include timestamps if available
   - Use consistent field naming (camelCase recommended)

---

## 📝 Testing Checklist

When backend is ready, test:

- [ ] Create employee (valid data)
- [ ] Create employee (duplicate ID) → 409
- [ ] Create employee (duplicate email) → 409
- [ ] Create employee (invalid email) → 400
- [ ] Create employee (missing fields) → 400
- [ ] Get all employees
- [ ] Get employee by ID (exists)
- [ ] Get employee by ID (not exists) → 404
- [ ] Delete employee (exists)
- [ ] Delete employee (not exists) → 404
- [ ] Verify cascade delete (attendance deleted)
- [ ] Mark attendance (new)
- [ ] Mark attendance (update existing)
- [ ] Mark attendance (invalid employee) → 404
- [ ] Mark attendance (invalid status) → 400
- [ ] Get attendance by employee (exists)
- [ ] Get attendance by employee (not exists) → 404
- [ ] Get attendance by date
- [ ] Health check endpoint
- [ ] CORS headers present
- [ ] Error responses have proper format

---

## 🚀 Ready for Backend Development

All frontend code is complete and documented. When you provide the backend folder, I will:

1. Create Spring Boot application structure
2. Implement Employee entity and repository
3. Implement Attendance entity and repository
4. Create REST controllers with all endpoints
5. Add validation and error handling
6. Configure CORS
7. Set up database (MongoDB or JPA)
8. Add proper error responses
9. Implement cascade delete
10. Add health check endpoint

**Status**: ✅ Frontend saved and documented
**Next Step**: Awaiting backend folder to create Spring Boot implementation
