# HRMS Lite - Frontend Complete Documentation

## 📋 Overview
This document contains the complete frontend implementation details for HRMS Lite. This will be used as reference when creating the Spring Boot backend.

---

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Purple (#667eea) → Indigo (#764ba2) → Purple
- **Success**: Green (#10b981) → Emerald (#059669)
- **Danger**: Red (#ef4444) → Pink (#ec4899)
- **Background**: Animated multi-color gradient (Purple, Indigo, Pink, Cyan, Blue)

### Design Features
- Glass morphism effects with backdrop blur
- Animated gradient backgrounds
- Floating blob decorations
- Shimmer effects on hover
- Smooth transitions (300-500ms)
- Multi-layer shadows and glows
- Gradient text animations

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── Topbar.jsx          # Top header bar
│   └── ui/
│       ├── Button.jsx          # Reusable button component
│       ├── Input.jsx           # Form input component
│       ├── Select.jsx          # Dropdown select component
│       ├── Badge.jsx           # Status badge component
│       ├── Card.jsx             # Card container component
│       ├── Modal.jsx            # Modal dialog component
│       ├── Table.jsx            # Table components (Table, TableHeader, TableBody, etc.)
│       ├── Loader.jsx           # Loading spinner component
│       ├── EmptyState.jsx       # Empty state component
│       ├── Toast.jsx            # Toast notification component
│       └── ToastContainer.jsx   # Toast container
├── contexts/
│   └── ToastContext.jsx        # Toast notification context
├── hooks/
│   ├── useToast.js             # Toast hook (re-exported from context)
│   └── useModal.js             # Modal state management hook
├── pages/
│   ├── Dashboard.jsx           # Dashboard page with statistics
│   ├── Employees.jsx           # Employee management page
│   └── Attendance.jsx          # Attendance management page
├── services/
│   └── api.js                  # Axios API configuration
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
└── index.css                    # Global styles and animations
```

---

## 🔌 API Endpoints Expected

### Base URL
- Development: `http://localhost:8080/api`
- Production: Configured via `VITE_API_URL` environment variable

### Employee Endpoints

#### 1. GET /api/employees
**Description**: Get all employees

**Response**:
```json
[
  {
    "_id": "string",
    "employeeId": "string",
    "fullName": "string",
    "email": "string",
    "department": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
]
```

#### 2. GET /api/employees/:id
**Description**: Get employee by ID

**Response**:
```json
{
  "_id": "string",
  "employeeId": "string",
  "fullName": "string",
  "email": "string",
  "department": "string"
}
```

#### 3. POST /api/employees
**Description**: Create a new employee

**Request Body**:
```json
{
  "employeeId": "string (required, unique)",
  "fullName": "string (required, min 2 chars)",
  "email": "string (required, valid email format)",
  "department": "string (required)"
}
```

**Response**: Created employee object (201 status)

**Error Responses**:
- 400: Validation failed
- 409: Duplicate employee ID or email

#### 4. DELETE /api/employees/:id
**Description**: Delete an employee by ID

**Response**: 
```json
{
  "message": "Employee deleted successfully",
  "employee": { ... }
}
```

**Note**: Should also delete all attendance records for this employee

---

### Attendance Endpoints

#### 1. POST /api/attendance
**Description**: Mark attendance for an employee

**Request Body**:
```json
{
  "employeeId": "string (required)",
  "date": "ISO date string (required, format: YYYY-MM-DD)",
  "status": "Present | Absent (required)"
}
```

**Response**:
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "_id": "string",
    "employeeId": "string",
    "date": "ISO date string",
    "status": "Present | Absent",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
}
```

**Note**: If attendance already exists for the same employee and date, it should update the existing record instead of creating a duplicate.

**Error Responses**:
- 400: Validation failed
- 404: Employee not found
- 409: Duplicate attendance (if not handled by update logic)

#### 2. GET /api/attendance/:employeeId
**Description**: Get all attendance records for a specific employee

**Response**:
```json
[
  {
    "_id": "string",
    "employeeId": "string",
    "date": "ISO date string",
    "status": "Present | Absent",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
]
```

**Error Responses**:
- 404: Employee not found

#### 3. GET /api/attendance/date/:date
**Description**: Get all attendance records for a specific date

**URL Parameter**: date in format YYYY-MM-DD

**Response**:
```json
[
  {
    "_id": "string",
    "employeeId": "string",
    "date": "ISO date string",
    "status": "Present | Absent"
  }
]
```

---

### Health Check

#### GET /api/health
**Description**: API health check endpoint

**Response**:
```json
{
  "status": "OK",
  "message": "HRMS Lite API is running"
}
```

---

## 📊 Data Models

### Employee Model
```javascript
{
  _id: String (MongoDB ObjectId or UUID),
  employeeId: String (required, unique, indexed),
  fullName: String (required, min 2 characters),
  email: String (required, unique, valid email format, lowercase),
  department: String (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Attendance Model
```javascript
{
  _id: String (MongoDB ObjectId or UUID),
  employeeId: String (required, indexed, references Employee),
  date: Date (required, indexed, normalized to start of day),
  status: String (required, enum: ["Present", "Absent"]),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Constraints**:
- Unique constraint on (employeeId, date) - one attendance record per employee per day
- Date should be normalized to start of day (00:00:00) for consistency

---

## 🎯 Frontend Features & Functionality

### 1. Dashboard Page (`/`)

**Features**:
- Display total employees count
- Display present employees count for today
- Display absent employees count for today
- Show recent attendance records in a table
- Statistics cards with animated icons
- Empty state when no data available

**Components Used**:
- Layout, Card, Table, Badge, Loader, EmptyState

**API Calls**:
- GET /api/employees
- GET /api/attendance/date/:today (or fetch all and filter)

---

### 2. Employees Page (`/employees`)

**Features**:
- Add new employee via modal form
- View all employees in a table
- Delete employee with confirmation modal
- Form validation (client-side and server-side)
- Empty state when no employees
- Loading states
- Success/error toast notifications

**Form Fields**:
- Employee ID (required, unique)
- Full Name (required, min 2 chars)
- Email (required, valid format)
- Department (required)

**Validation**:
- Client-side: Real-time validation with error messages
- Server-side: Required fields, email format, duplicate checks

**API Calls**:
- GET /api/employees
- POST /api/employees
- DELETE /api/employees/:id

**Components Used**:
- Layout, Card, Table, Button, Input, Modal, Loader, EmptyState, Toast

---

### 3. Attendance Page (`/attendance`)

**Features**:
- Mark attendance for employees
- Select employee from dropdown
- Date picker (max date: today)
- Status selector (Present/Absent)
- View attendance records per employee
- Filter attendance records by date
- Display total present days per employee
- Empty states for different scenarios

**Form Fields**:
- Employee (dropdown, required)
- Date (date picker, required, max: today)
- Status (dropdown: Present/Absent, required)

**Features**:
- Real-time filtering by date
- Total present days calculation
- Employee info card with statistics

**API Calls**:
- GET /api/employees (for dropdown)
- POST /api/attendance
- GET /api/attendance/:employeeId

**Components Used**:
- Layout, Card, Button, Input, Select, Table, Badge, Loader, EmptyState, Toast

---

## 🎨 UI Components Details

### Button Component
**Variants**: primary, secondary, danger, outline, ghost
**Sizes**: sm, md, lg
**Features**: 
- Gradient backgrounds
- Shimmer effect on hover
- Scale animations
- Glow effects

### Input Component
**Features**:
- Label with required indicator
- Error message display
- Focus states with purple theme
- Hover effects
- Backdrop blur

### Select Component
**Features**:
- Custom styled dropdown
- Custom arrow icon
- Error states
- Same styling as Input

### Badge Component
**Variants**: default, primary, success, danger, warning, info
**Features**:
- Gradient backgrounds
- Hover scale animation
- Shadow effects

### Card Component
**Features**:
- Glass morphism effect
- Shimmer overlay on hover
- Gradient borders
- Hover animations
- Optional header with title/subtitle/actions

### Modal Component
**Features**:
- Glass morphism
- Gradient header
- Overlay with backdrop blur
- Close button
- Optional footer
- Size variants: sm, md, lg, xl

### Table Components
**Components**: Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell
**Features**:
- Gradient header
- Hover effects on rows
- Glass morphism body
- Left border accent on hover

### Toast Component
**Types**: success, error, info, warning
**Features**:
- Auto-dismiss after duration
- Slide-in animation
- Icon indicators
- Hover scale effect

---

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:8080/api
```

### API Service (`src/services/api.js`)
- Base URL from environment variable
- Default: `http://localhost:8080/api`
- Content-Type: application/json
- Error handling interceptor
- Connection error handling

---

## 🎭 Animations & Effects

### CSS Animations
1. **gradientShift**: Animated background gradient (15s infinite)
2. **blob**: Floating blob animation (7s infinite)
3. **shimmer**: Shimmer effect (3s infinite)
4. **float**: Floating animation (3s infinite)
5. **glow-pulse**: Pulsing glow effect (2s infinite)
6. **fade-in**: Fade in with translate (0.5s)
7. **slide-in**: Slide in from right (0.3s)
8. **bounce-in**: Bounce in animation (0.6s)
9. **gradient-text**: Animated gradient text (3s infinite)

### Interactive Effects
- Hover scale transformations
- Shadow transitions
- Color transitions
- Shimmer overlays
- Glow effects

---

## 📱 Responsive Design

- Desktop-first approach
- Mobile-friendly layouts
- Responsive grid systems
- Flexible sidebar (fixed on desktop)
- Responsive tables with horizontal scroll

---

## 🚨 Error Handling

### Client-Side
- Form validation with inline error messages
- Toast notifications for API errors
- Loading states during API calls
- Empty states when no data
- Connection error messages

### Expected Server Errors
- 400: Validation errors (with error details)
- 404: Resource not found
- 409: Duplicate entries
- 500: Server errors

**Error Response Format**:
```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🎯 Key Functionalities to Implement in Backend

1. **Employee Management**
   - CRUD operations
   - Unique employee ID validation
   - Unique email validation
   - Email format validation
   - Cascade delete (delete attendance when employee deleted)

2. **Attendance Management**
   - Mark attendance (create or update)
   - Get attendance by employee
   - Get attendance by date
   - Unique constraint: one record per employee per day
   - Date normalization (start of day)

3. **Validation**
   - Required field validation
   - Email format validation
   - Duplicate prevention
   - Data type validation

4. **Error Handling**
   - Proper HTTP status codes
   - Meaningful error messages
   - Validation error details

5. **Database**
   - Indexes on employeeId, email, date
   - Unique constraints
   - Timestamps (createdAt, updatedAt)

---

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "axios": "^1.13.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.12.0"
}
```

### Dev Dependencies
```json
{
  "tailwindcss": "^3.4.19",
  "postcss": "^8.5.6",
  "autoprefixer": "^10.4.23",
  "vite": "^7.2.4"
}
```

---

## 🚀 Deployment Notes

### Frontend Build
- Build command: `npm run build`
- Output directory: `dist/`
- Environment variables must be set for production API URL

### Backend Requirements
- Must support CORS for frontend domain
- Must handle preflight requests
- API should be RESTful
- JSON request/response format
- Proper error responses

---

## 📝 Important Notes for Backend Development

1. **Date Handling**: 
   - Dates should be normalized to start of day (00:00:00)
   - Use ISO 8601 format for date strings
   - Timezone handling should be consistent

2. **Employee ID**:
   - Must be unique across all employees
   - Case-sensitive or case-insensitive (specify in backend)
   - Used as identifier in DELETE and GET requests

3. **Attendance Updates**:
   - If attendance exists for same employee + date, update status
   - Don't create duplicate records
   - Return appropriate message ("marked" vs "updated")

4. **Cascade Operations**:
   - When employee is deleted, delete all their attendance records
   - This is expected by the frontend

5. **Response Format**:
   - Always return JSON
   - Include timestamps (createdAt, updatedAt) if possible
   - Use consistent field names (camelCase or snake_case)

---

## ✅ Testing Checklist for Backend

- [ ] Create employee with valid data
- [ ] Reject duplicate employee ID
- [ ] Reject duplicate email
- [ ] Validate email format
- [ ] Validate required fields
- [ ] Get all employees
- [ ] Get employee by ID
- [ ] Delete employee
- [ ] Cascade delete attendance on employee delete
- [ ] Mark attendance (new)
- [ ] Update attendance (existing)
- [ ] Get attendance by employee
- [ ] Get attendance by date
- [ ] Validate attendance status enum
- [ ] Handle invalid employee ID in attendance
- [ ] Health check endpoint
- [ ] CORS configuration
- [ ] Error responses with proper status codes

---

## 📞 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/employees | Get all employees |
| GET | /api/employees/:id | Get employee by ID |
| POST | /api/employees | Create employee |
| DELETE | /api/employees/:id | Delete employee |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/:employeeId | Get attendance by employee |
| GET | /api/attendance/date/:date | Get attendance by date |

---

**Document Created**: Complete frontend documentation for HRMS Lite
**Purpose**: Reference for Spring Boot backend development
**Status**: Ready for backend implementation
