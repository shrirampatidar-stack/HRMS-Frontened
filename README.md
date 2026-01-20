# HRMS Lite - Full-Stack Human Resource Management System

A lightweight, full-stack Human Resource Management System built with React (Vite) and Node.js/Express/MongoDB. This application allows administrators to manage employee records and track daily attendance.

## 🚀 Features

### Core Features
- **Employee Management**
  - Add new employees with unique Employee ID, Full Name, Email, and Department
  - View all employees in a clean, organized layout
  - Delete employees with confirmation
  - Client-side and server-side validation
  - Duplicate employee ID/email prevention

- **Attendance Management**
  - Mark attendance for employees (Present/Absent)
  - View attendance records per employee
  - Filter attendance by date
  - Display total present days per employee
  - Prevent duplicate attendance entries for the same date

- **Dashboard**
  - View total employees count
  - View present/absent counts for today
  - Recent attendance records table

### Bonus Features ✨
- Filter attendance records by date
- Display total present days per employee
- Dashboard summary with statistics and recent attendance table

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
HR-PORTAL/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   │   ├── Card.jsx
│   │   ├── ErrorAlert.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   └── SuccessAlert.jsx
│   ├── pages/              # Page components
│   │   ├── Attendance.jsx
│   │   ├── Dashboard.jsx
│   │   └── Employees.jsx
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── server/                 # Backend source code
│   ├── models/             # Mongoose models
│   │   ├── Employee.js
│   │   └── Attendance.js
│   ├── routes/             # API routes
│   │   ├── employees.js
│   │   └── attendance.js
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .gitignore
├── public/                 # Static assets
├── package.json            # Frontend dependencies
└── README.md
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HR-PORTAL
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/hrms-lite
   NODE_ENV=development
   ```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite?retryWrites=true&w=majority
   ```

   For frontend, create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

5. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas cloud service (no local installation needed).

6. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:8080`

7. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

8. **Access the Application**
   - Frontend: Open `http://localhost:5173` in your browser
   - Backend API: `http://localhost:8080/api`
   - Health Check: `http://localhost:8080/api/health`

## 📦 Build for Production

### Frontend
```bash
npm run build
```

The production build will be in the `dist/` directory.

### Backend
The backend doesn't require a build step. Just ensure environment variables are set correctly.

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments.

3. **Set Environment Variables in Vercel:**
   - `VITE_API_URL` = Your deployed backend URL (e.g., `https://your-backend.railway.app/api`)

4. **Deploy to Netlify:**
   - Drag and drop the `dist/` folder, or
   - Connect GitHub repository and set build command: `npm run build` and publish directory: `dist`

### Backend Deployment (Railway/Render)

#### Railway
1. Connect your GitHub repository to Railway
2. Set root directory to `server`
3. Add environment variables:
   - `PORT` (Railway will provide this automatically)
   - `MONGODB_URI` (Your MongoDB connection string)
   - `NODE_ENV=production`
4. Deploy

#### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
5. Deploy

### MongoDB Setup
- Use **MongoDB Atlas** (free tier available) for cloud database
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and add to backend environment variables

## 📡 API Endpoints

### Employee Endpoints

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create a new employee
  ```json
  {
    "employeeId": "EMP001",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "department": "Engineering"
  }
  ```
- `DELETE /api/employees/:id` - Delete an employee

### Attendance Endpoints

- `POST /api/attendance` - Mark attendance
  ```json
  {
    "employeeId": "EMP001",
    "date": "2024-01-15",
    "status": "Present"
  }
  ```
- `GET /api/attendance/:employeeId` - Get attendance records for an employee
- `GET /api/attendance/date/:date` - Get attendance records for a specific date

### Health Check
- `GET /api/health` - Check API health status

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Shows loading indicators during API calls
- **Error Handling**: User-friendly error messages with alerts
- **Success Feedback**: Success notifications for completed actions
- **Form Validation**: Real-time validation with error messages
- **Empty States**: Helpful messages when no data is available
- **Navigation**: Clean navigation bar with active route highlighting

## ⚙️ Validation & Error Handling

### Client-Side Validation
- Required field validation
- Email format validation
- Real-time error display

### Server-Side Validation
- Request body validation using express-validator
- Duplicate employee ID/email prevention
- Duplicate attendance entry prevention
- Proper HTTP status codes
- Meaningful error messages

## 🧪 Testing the Application

1. **Add Employees:**
   - Navigate to Employees page
   - Fill in all required fields
   - Submit and verify employee appears in the list

2. **Mark Attendance:**
   - Go to Attendance page
   - Select an employee
   - Choose date and status
   - Mark attendance and verify it appears in records

3. **View Dashboard:**
   - Check total employees count
   - View today's attendance statistics
   - Review recent attendance records

4. **Test Error Cases:**
   - Try adding duplicate employee ID
   - Try adding invalid email format
   - Try marking attendance without selecting employee

## 📝 Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required)
- Date format: YYYY-MM-DD (ISO 8601)
- One attendance record per employee per day (updates existing if duplicate)

### Limitations
- No user authentication (single admin access)
- No leave management
- No payroll features
- No advanced reporting
- No email notifications
- No employee profile pictures

## 🚀 Future Enhancements

Potential features for future development:
- User authentication and authorization
- Employee profile pages with photos
- Leave management system
- Payroll integration
- Advanced reporting and analytics
- Email notifications
- Export data to CSV/PDF
- Employee performance tracking

## 📄 License

This project is created as part of a coding assignment.

## 👨‍💻 Development

### Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 📞 Support

For issues or questions, please check the code comments or refer to the API documentation above.

---

**Note:** Ensure MongoDB is running before starting the backend server. For production deployment, use MongoDB Atlas or another cloud MongoDB service.
