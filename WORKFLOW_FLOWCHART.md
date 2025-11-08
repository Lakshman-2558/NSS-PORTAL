# NSS Portal - Complete Workflow Flowchart

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NSS PORTAL SYSTEM                         │
│                                                                   │
│  Frontend (React)  ←→  Backend (Express)  ←→  Database (MongoDB) │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Main User Journey

```
START → Landing Page
         ↓
    User Decision?
    ├─→ New User → Register → Dashboard
    └─→ Existing User → Login → Dashboard
                                  ↓
                         Role-Based Redirect
                         ├─→ Student Dashboard
                         ├─→ Admin Dashboard
                         └─→ Faculty Dashboard
```

---

## 🔐 Authentication Flow

```
REGISTER                           LOGIN
   ↓                                 ↓
Fill Form                       Fill Form
   ↓                                 ↓
POST /api/auth/register        POST /api/auth/login
   ↓                                 ↓
Hash Password                   Validate Credentials
   ↓                                 ↓
Create User                     Generate JWT Token
   ↓                                 ↓
Generate Token                  Store in Context
   ↓                                 ↓
Store in LocalStorage          Store in LocalStorage
   ↓                                 ↓
Redirect to Dashboard          Redirect to Dashboard
```

---

## 👨‍🎓 Student Workflow

```
Student Dashboard (VibrantPageLayout)
├─→ View Statistics (Animated Counters)
├─→ Browse Events → Register → Wait Approval
├─→ Attend Event → Submit Report → Wait Review
├─→ Report Approved → Hours Added → Certificate
└─→ View Profile & Certificates
```

### Student Event Registration Flow

```
Events Page
   ↓
GET /api/events
   ↓
Display Events
   ↓
Click "Register"
   ↓
POST /api/participations
   ↓
Status: Pending
   ↓
Admin Reviews
   ↓
├─→ Approved → Attend Event
└─→ Rejected → Try Another
```

### Student Report Submission Flow

```
Submit Report Page
   ↓
Fill Report Form + Upload Images
   ↓
POST /api/reports
   ↓
Upload to Cloudinary
   ↓
Status: Pending
   ↓
Admin Reviews
   ↓
├─→ Approved → Hours Added → Certificate Generated
└─→ Rejected → Resubmit with Feedback
```

---

## 👨‍💼 Admin Workflow

```
Admin Dashboard (VibrantPageLayout)
├─→ View System Statistics
├─→ Create/Manage Events
├─→ Review Participations (Approve/Reject)
├─→ Review Reports (Approve/Reject)
├─→ Generate Certificates
└─→ View AI Reports
```

### Admin Event Management

```
Events Management
   ↓
Create Event Form
   ↓
POST /api/events
   ↓
Event Published
   ↓
Students Register
   ↓
Admin Reviews Registrations
```

### Admin Report Review

```
Reports Page
   ↓
GET /api/reports/all
   ↓
Filter by Status
   ↓
Review Report Details
   ↓
Decision?
├─→ Approve → Add Hours → Update Status
└─→ Reject → Add Reason → Notify Student
```

### Certificate Generation

```
Certificate Config
   ↓
Setup Template
   ↓
Select Eligible Students
   ↓
POST /api/certificates/generate
   ↓
Generate PDF
   ↓
Upload to Cloudinary
   ↓
Link to Student
   ↓
Student Downloads
```

---

## 🎨 Theme Architecture

```
Landing Page (No VibrantPageLayout)
   ↓
Login/Register (Vibrant Background)
   ↓
After Login
   ↓
VibrantPageLayout Wrapper
├─→ Hero Section (Background Image + Overlay)
├─→ Animated Counters (4 stats with count-up)
├─→ Main Content Area (Page-specific content)
└─→ Blog/News Sidebar (Recent activities)
```

---

## 📊 API Endpoints Summary

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Events
- GET /api/events - Get all events
- POST /api/events - Create event (Admin)
- PUT /api/events/:id - Update event (Admin)
- DELETE /api/events/:id - Delete event (Admin)

### Participations
- POST /api/participations - Register for event
- GET /api/participations - Get user participations
- GET /api/participations/all - Get all (Admin)
- PUT /api/participations/:id/approve - Approve (Admin)
- PUT /api/participations/:id/reject - Reject (Admin)

### Reports
- POST /api/reports - Submit report
- GET /api/reports - Get user reports
- GET /api/reports/all - Get all (Admin)
- PUT /api/reports/:id/approve - Approve (Admin)
- PUT /api/reports/:id/reject - Reject (Admin)

### Certificates
- POST /api/certificates/generate - Generate certificate
- GET /api/certificates/my-certificates - Get user certificates
- POST /api/certificates/config - Save config (Admin)

### Statistics
- GET /api/stats/landing - Landing page stats
- GET /api/users/stats - System stats (Admin)

---

## 🔄 Data Flow

```
Frontend Component
   ↓
API Call (Axios)
   ↓
Backend Route
   ↓
Middleware (Auth Check)
   ↓
Controller Logic
   ↓
Mongoose Model
   ↓
MongoDB Database
   ↓
Response Data
   ↓
Update Component State
   ↓
Re-render UI
```

---

## 📦 Component Hierarchy

```
App.js
├── Landing.jsx
│   ├── ImageSlider
│   └── Statistics
├── Auth/
│   ├── Login.js
│   └── Register.js
├── Student/
│   ├── Dashboard.js (VibrantPageLayout)
│   ├── Events.js
│   ├── Profile.js
│   ├── SubmitReport.js
│   └── MyReports.js
└── Admin/
    ├── Dashboard.js (VibrantPageLayout)
    ├── Events.js
    ├── Participations.js
    ├── Reports.js
    └── CertificateConfig.js
```

---

## 🎯 Key Features

### 1. Animated Counters
```
Mount → Fetch Data → Start Animation → Count Up (2s) → Display
```

### 2. Image Slider
```
Mount → Load Images → Auto-play (5s) → Transition → Loop
```

### 3. Vibrant Theme
```
Background Image → Overlay → Counters → Content → Blog Sidebar
```

### 4. Certificate Generation
```
Template → Student Data → Generate PDF → Upload → Link → Download
```

---

## 🔐 Security Flow

```
User Login
   ↓
Generate JWT Token
   ↓
Store in LocalStorage
   ↓
Include in API Headers
   ↓
Backend Middleware Verifies
   ↓
Check Role Permissions
   ↓
Process Request or Return Error
```

---

## 📱 State Management

```
AuthContext (Global)
├─→ user
├─→ token
├─→ isAuthenticated
└─→ Actions (login, logout, register)
     ↓
Components Access via useAuth()
     ↓
Auto Re-render on State Change
```

---

## 🚀 Complete User Journey

```
1. Visit Landing Page
2. View NSS Info & Statistics
3. Login/Register
4. Role-Based Dashboard
5. STUDENT: Browse → Register → Attend → Report → Certificate
6. ADMIN: Create Events → Review → Approve → Generate Certificates
7. Logout
```

---

## 📊 Database Relationships

```
User
├─→ Participations
├─→ Reports
└─→ Certificates

Event
├─→ Participations
└─→ Reports

Participation
├─→ User
├─→ Event
├─→ Report
└─→ Certificate
```

---

**Last Updated:** November 2024  
**Version:** 1.0  
**Author:** NSS Portal Development Team
