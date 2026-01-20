# Quick Start Guide - HRMS Lite

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Set Up MongoDB

**Option A: Use MongoDB Atlas (Recommended - Free)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/hrms-lite?retryWrites=true&w=majority`)

**Option B: Use Local MongoDB**
1. Install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service: `mongod`
3. Connection string: `mongodb://localhost:27017/hrms-lite`

### Step 3: Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/hrms-lite
# Or use MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite
NODE_ENV=development
```

**Frontend (root `.env`):**
```env
VITE_API_URL=http://localhost:8080/api
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 5: Access the Application

- **Frontend**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

## ✅ Verify Installation

1. Open the frontend in your browser
2. Navigate to "Employees" page
3. Add a test employee:
   - Employee ID: `EMP001`
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Department: `Engineering`
4. Navigate to "Attendance" page
5. Select the employee and mark attendance

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running (if using local MongoDB)
- Verify MongoDB connection string in `server/.env`
- Check if port 8080 is already in use

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check `VITE_API_URL` in `.env` file
- Verify CORS is enabled in backend (it should be)

### MongoDB connection errors
- Verify connection string format
- Check MongoDB Atlas network access (if using Atlas)
- Ensure MongoDB credentials are correct

## 📝 Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Review API endpoints in the README
3. Customize the application as needed

---

**Need help?** Check the main README.md for more detailed instructions.
