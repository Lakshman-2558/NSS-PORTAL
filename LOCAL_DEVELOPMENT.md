# Local Development Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend` folder with:

```env
MONGODB_URI=mongodb://localhost:27017/nss-portal
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

### 3. Start MongoDB

Make sure MongoDB is running locally on port 27017.

### 4. Run the Application

**Option A: Run both frontend and backend together**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Troubleshooting

### Proxy Error (ECONNREFUSED)

If you see:
```
Proxy error: Could not proxy request /api/... from localhost:3000 to http://localhost:5000/
```

**Solution**: The backend server is not running. Start it with:
```bash
npm run server
```

### Port Already in Use

**Kill processes on ports 3000 or 5000:**

Windows:
```bash
# Kill port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use the provided script
kill-ports.bat
```

Linux/Mac:
```bash
# Kill port 5000
lsof -ti:5000 | xargs kill -9

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error

1. Ensure MongoDB is installed and running
2. Check connection string in `.env`
3. Try connecting with MongoDB Compass to verify

### Environment Variables Not Loading

1. Ensure `.env` file is in the `backend` folder
2. Restart the backend server
3. Check for typos in variable names
