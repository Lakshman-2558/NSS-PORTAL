# Software Requirements Specification (SRS)
## NSS Portal - National Service Scheme Management System

---

## Document Information

| **Project Name** | NSS Portal - National Service Scheme Management System |
|------------------|--------------------------------------------------------|
| **Version** | 1.0 |
| **Date** | November 11, 2025 |
| **Prepared By** | Development Team |
| **Organization** | Vignan's University Extension Activities Council (VUEAC) |
| **Document Status** | Final |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [System Requirements](#5-system-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Other Requirements](#7-other-requirements)
8. [Appendices](#8-appendices)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of the NSS Portal system. It details the functional and non-functional requirements for the National Service Scheme (NSS) management platform designed for Vignan's University Extension Activities Council (VUEAC).

### 1.2 Scope
The NSS Portal is a comprehensive web-based application that:
- Manages student volunteer registrations and profiles
- Facilitates event creation, registration, and attendance tracking
- Enables activity report submission and evaluation
- Generates digital certificates for participation
- Provides analytics and insights for administrators
- Supports multi-role access (Students, Program Officers, Coordinators, Admins)

**Benefits:**
- Streamlined NSS activity management
- Paperless documentation and certification
- Real-time tracking and reporting
- Enhanced communication between stakeholders
- Data-driven decision making

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **NSS** | National Service Scheme |
| **VUEAC** | Vignan's University Extension Activities Council |
| **PO** | Program Officer |
| **SRS** | Software Requirements Specification |
| **UI** | User Interface |
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token |
| **CRUD** | Create, Read, Update, Delete |
| **PDF** | Portable Document Format |
| **CSV** | Comma-Separated Values |

### 1.4 References
- National Service Scheme Guidelines (Ministry of Youth Affairs and Sports)
- Vignan's University NSS Policies
- IEEE Std 830-1998 (Software Requirements Specification)
- MERN Stack Documentation (MongoDB, Express.js, React, Node.js)

### 1.5 Overview
This document is organized into eight main sections covering introduction, system description, features, interfaces, requirements, and appendices. It serves as the primary reference for developers, testers, and stakeholders.

---

## 2. Overall Description

### 2.1 Product Perspective
The NSS Portal is a standalone web application that integrates with:
- University student database (for authentication)
- Email services (for notifications)
- Cloud storage (for document management)
- Analytics platforms (for reporting)

**System Context Diagram:**
```
┌─────────────────────────────────────────────────────┐
│                  NSS Portal System                  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Frontend │  │ Backend  │  │ Database │         │
│  │ (React)  │◄─┤(Node.js) │◄─┤(MongoDB) │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│       │              │              │              │
└───────┼──────────────┼──────────────┼──────────────┘
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌─────────┐    ┌─────────┐
   │ Users  │    │ Email   │    │ Cloud   │
   │(Browser)│   │ Service │    │ Storage │
   └────────┘    └─────────┘    └─────────┘
```

### 2.2 Product Functions
**Major Functions:**
1. **User Management**
   - Registration and authentication
   - Profile management
   - Role-based access control

2. **Event Management**
   - Event creation and scheduling
   - Registration and attendance tracking
   - Event analytics

3. **Report Management**
   - Activity report submission
   - Report review and approval
   - Feedback system

4. **Certificate Generation**
   - Automated certificate creation
   - Digital signature integration
   - Download and verification

5. **Analytics Dashboard**
   - Volunteer statistics
   - Event participation metrics
   - Performance reports

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Expertise | Frequency of Use |
|------------|-------------|---------------------|------------------|
| **Student Volunteer** | NSS participants | Basic | Daily/Weekly |
| **Program Officer** | Faculty coordinators | Intermediate | Daily |
| **NSS Coordinator** | Department heads | Intermediate | Weekly |
| **System Administrator** | IT support staff | Advanced | As needed |
| **Guest/Visitor** | Public users | Basic | Occasional |

### 2.4 Operating Environment
**Hardware:**
- Client: Any device with web browser (Desktop, Laptop, Tablet, Mobile)
- Server: Cloud-based infrastructure (AWS, Azure, or similar)

**Software:**
- Client: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Server: Node.js 16+, MongoDB 5+
- Operating System: Platform-independent (Windows, macOS, Linux, iOS, Android)

### 2.5 Design and Implementation Constraints
1. **Technology Stack:** MERN (MongoDB, Express.js, React, Node.js)
2. **Security:** JWT-based authentication, HTTPS encryption
3. **Compliance:** Data privacy regulations (GDPR-like standards)
4. **Browser Compatibility:** Support for modern browsers only
5. **Performance:** Page load time < 3 seconds
6. **Scalability:** Support for 10,000+ concurrent users

### 2.6 Assumptions and Dependencies
**Assumptions:**
- Users have stable internet connectivity
- Users have basic computer literacy
- University provides student data access
- Email service is available for notifications

**Dependencies:**
- Third-party email service (e.g., SendGrid, AWS SES)
- Cloud hosting provider (e.g., AWS, Vercel, Render)
- MongoDB Atlas or similar database service
- SSL certificate provider

---

## 3. System Features

### 3.1 User Registration and Authentication

#### 3.1.1 Description
Allows new users to register and existing users to authenticate securely.

#### 3.1.2 Priority
**High** - Critical for system access

#### 3.1.3 Functional Requirements

**FR-1.1:** The system shall allow students to register using university email ID.
- **Input:** Name, Email, Password, Roll Number, Department, Year
- **Process:** Validate email format, check for duplicates, hash password
- **Output:** User account created, verification email sent

**FR-1.2:** The system shall send email verification links to new users.
- **Input:** User email address
- **Process:** Generate unique token, send email with link
- **Output:** Verification email delivered

**FR-1.3:** The system shall authenticate users using email and password.
- **Input:** Email, Password
- **Process:** Verify credentials, generate JWT token
- **Output:** Access token, user session created

**FR-1.4:** The system shall support password reset functionality.
- **Input:** Email address
- **Process:** Send reset link, validate token, update password
- **Output:** Password updated successfully

**FR-1.5:** The system shall implement role-based access control.
- **Roles:** Student, Program Officer, Coordinator, Admin
- **Process:** Assign roles during registration/approval
- **Output:** Role-specific dashboard access

### 3.2 Event Management

#### 3.2.1 Description
Enables creation, management, and participation in NSS events.

#### 3.2.2 Priority
**High** - Core functionality

#### 3.2.3 Functional Requirements

**FR-2.1:** Program Officers shall be able to create new events.
- **Input:** Event name, description, date, time, location, capacity, category
- **Process:** Validate data, store in database
- **Output:** Event created, visible to students

**FR-2.2:** Students shall be able to browse and search events.
- **Input:** Search query, filters (date, category, location)
- **Process:** Query database, apply filters
- **Output:** List of matching events

**FR-2.3:** Students shall be able to register for events.
- **Input:** Event ID, Student ID
- **Process:** Check capacity, validate eligibility
- **Output:** Registration confirmed, notification sent

**FR-2.4:** The system shall track event attendance.
- **Input:** Event ID, Student ID, Check-in time
- **Process:** Record attendance, update status
- **Output:** Attendance marked

**FR-2.5:** Program Officers shall be able to manage event registrations.
- **Input:** Event ID
- **Process:** View registrations, approve/reject
- **Output:** Updated registration status

**FR-2.6:** The system shall send event reminders.
- **Input:** Event date/time
- **Process:** Check upcoming events, send notifications
- **Output:** Email/SMS reminders sent

### 3.3 Report Submission and Management

#### 3.3.1 Description
Facilitates activity report submission, review, and approval.

#### 3.3.2 Priority
**High** - Essential for documentation

#### 3.3.3 Functional Requirements

**FR-3.1:** Students shall be able to submit activity reports.
- **Input:** Event ID, Description, Photos, Documents
- **Process:** Validate files, store in cloud storage
- **Output:** Report submitted for review

**FR-3.2:** The system shall support file uploads (images, PDFs).
- **Input:** Files (max 10MB each)
- **Process:** Validate format, compress images, upload to cloud
- **Output:** Files stored, URLs saved

**FR-3.3:** Program Officers shall be able to review reports.
- **Input:** Report ID
- **Process:** Display report details, photos, documents
- **Output:** Review interface with approve/reject options

**FR-3.4:** The system shall provide feedback on reports.
- **Input:** Report ID, Feedback text, Status (approved/rejected)
- **Process:** Update report status, send notification
- **Output:** Feedback saved, student notified

**FR-3.5:** Students shall be able to view report status and feedback.
- **Input:** Student ID
- **Process:** Query submitted reports
- **Output:** List of reports with status

### 3.4 Certificate Generation

#### 3.4.1 Description
Automated generation and distribution of participation certificates.

#### 3.4.2 Priority
**Medium** - Important for recognition

#### 3.4.3 Functional Requirements

**FR-4.1:** The system shall automatically generate certificates.
- **Input:** Student ID, Event ID, Attendance data
- **Process:** Create PDF with template, add student details
- **Output:** Digital certificate generated

**FR-4.2:** Students shall be able to download certificates.
- **Input:** Certificate ID
- **Process:** Retrieve PDF from storage
- **Output:** Certificate downloaded

**FR-4.3:** The system shall include verification codes on certificates.
- **Input:** Certificate data
- **Process:** Generate unique QR code/verification number
- **Output:** Verifiable certificate

**FR-4.4:** The system shall allow certificate verification.
- **Input:** Verification code
- **Process:** Query database for certificate
- **Output:** Certificate validity status

### 3.5 Analytics and Reporting

#### 3.5.1 Description
Provides insights and statistics on NSS activities.

#### 3.5.2 Priority
**Medium** - Valuable for decision-making

#### 3.5.3 Functional Requirements

**FR-5.1:** The system shall display volunteer statistics.
- **Metrics:** Total volunteers, active volunteers, hours contributed
- **Process:** Aggregate data from database
- **Output:** Dashboard with statistics

**FR-5.2:** The system shall generate event participation reports.
- **Input:** Date range, Event category
- **Process:** Query database, calculate metrics
- **Output:** Report with charts and graphs

**FR-5.3:** Coordinators shall be able to export data.
- **Input:** Report type, Date range
- **Process:** Generate CSV/PDF report
- **Output:** Downloadable file

**FR-5.4:** The system shall track individual volunteer progress.
- **Input:** Student ID
- **Process:** Calculate events attended, hours, certificates
- **Output:** Progress dashboard

### 3.6 Notification System

#### 3.6.1 Description
Sends timely notifications to users via email.

#### 3.6.2 Priority
**Medium** - Enhances user engagement

#### 3.6.3 Functional Requirements

**FR-6.1:** The system shall send event registration confirmations.
**FR-6.2:** The system shall send event reminders (24 hours before).
**FR-6.3:** The system shall notify report status updates.
**FR-6.4:** The system shall send certificate availability notifications.
**FR-6.5:** Users shall be able to manage notification preferences.

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Landing Page
- **Purpose:** Public-facing homepage
- **Elements:** Hero section, statistics, features, login/register buttons
- **Design:** Responsive, modern, accessible
- **Performance:** Load time < 2 seconds

#### 4.1.2 Student Dashboard
- **Purpose:** Student home screen after login
- **Elements:**
  - Welcome message with student name
  - Upcoming events section
  - Recent activities
  - Quick actions (Register for event, Submit report)
  - Statistics (Events attended, Hours contributed, Certificates earned)
- **Navigation:** Sidebar with Events, Reports, Certificates, Profile

#### 4.1.3 Event Listing Page
- **Purpose:** Browse and search events
- **Elements:**
  - Search bar with filters
  - Event cards with image, title, date, location
  - Pagination
  - Register button
- **Interactions:** Click to view details, filter by category/date

#### 4.1.4 Event Details Page
- **Purpose:** Detailed event information
- **Elements:**
  - Event banner image
  - Description, date, time, location, capacity
  - Registration status
  - Register/Cancel button
  - Map integration (optional)

#### 4.1.5 Report Submission Form
- **Purpose:** Submit activity reports
- **Elements:**
  - Event selection dropdown
  - Description text area
  - File upload (images, documents)
  - Submit button
- **Validation:** Required fields, file size limits

#### 4.1.6 Program Officer Dashboard
- **Purpose:** Manage events and reports
- **Elements:**
  - Event management section
  - Pending reports list
  - Attendance tracking
  - Analytics overview

#### 4.1.7 Admin Dashboard
- **Purpose:** System administration
- **Elements:**
  - User management
  - System statistics
  - Configuration settings
  - Logs and monitoring

### 4.2 Hardware Interfaces
**Not Applicable** - Web-based application with no direct hardware interaction.

### 4.3 Software Interfaces

#### 4.3.1 Database Interface
- **System:** MongoDB
- **Purpose:** Data persistence
- **Operations:** CRUD operations on collections
- **Collections:** users, events, reports, certificates, notifications

#### 4.3.2 Email Service Interface
- **System:** SendGrid / AWS SES / Nodemailer
- **Purpose:** Send transactional emails
- **Operations:** Send email, verify delivery
- **Data:** Recipient, subject, body, attachments

#### 4.3.3 Cloud Storage Interface
- **System:** AWS S3 / Cloudinary
- **Purpose:** Store uploaded files
- **Operations:** Upload, retrieve, delete files
- **Data:** Images, PDFs, documents

#### 4.3.4 Authentication Service
- **System:** JWT (JSON Web Tokens)
- **Purpose:** User authentication and authorization
- **Operations:** Generate token, verify token, refresh token
- **Data:** User ID, role, expiration

### 4.4 Communication Interfaces

#### 4.4.1 HTTP/HTTPS Protocol
- **Purpose:** Client-server communication
- **Standard:** RESTful API
- **Format:** JSON
- **Security:** HTTPS encryption (TLS 1.2+)

#### 4.4.2 WebSocket (Optional)
- **Purpose:** Real-time notifications
- **Use Case:** Live event updates, instant notifications
- **Protocol:** WebSocket over HTTPS

---

## 5. System Requirements

### 5.1 Functional Requirements Summary

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | User Registration and Authentication | High |
| FR-2 | Event Management | High |
| FR-3 | Report Submission and Management | High |
| FR-4 | Certificate Generation | Medium |
| FR-5 | Analytics and Reporting | Medium |
| FR-6 | Notification System | Medium |
| FR-7 | Profile Management | Low |
| FR-8 | Search and Filter | Medium |

### 5.2 Database Requirements

#### 5.2.1 User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  rollNumber: String,
  department: String,
  year: Number,
  role: String (enum: student, po, coordinator, admin),
  isVerified: Boolean,
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5.2.2 Event Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  date: Date,
  time: String,
  location: String,
  capacity: Number,
  registeredCount: Number,
  image: String (URL),
  createdBy: ObjectId (ref: User),
  status: String (enum: upcoming, ongoing, completed, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

#### 5.2.3 Registration Collection
```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: Event),
  studentId: ObjectId (ref: User),
  status: String (enum: registered, attended, absent, cancelled),
  registeredAt: Date,
  attendedAt: Date
}
```

#### 5.2.4 Report Collection
```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: Event),
  studentId: ObjectId (ref: User),
  description: String,
  photos: [String] (URLs),
  documents: [String] (URLs),
  status: String (enum: pending, approved, rejected),
  feedback: String,
  reviewedBy: ObjectId (ref: User),
  submittedAt: Date,
  reviewedAt: Date
}
```

#### 5.2.5 Certificate Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  certificateNumber: String (unique),
  verificationCode: String (unique),
  pdfUrl: String,
  issuedAt: Date
}
```

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements

**NFR-1.1:** The system shall load pages within 3 seconds on standard broadband.
**NFR-1.2:** The system shall support 10,000 concurrent users.
**NFR-1.3:** Database queries shall execute within 500ms.
**NFR-1.4:** API response time shall be < 1 second for 95% of requests.
**NFR-1.5:** The system shall handle 1000 file uploads simultaneously.

### 6.2 Safety Requirements

**NFR-2.1:** The system shall implement automatic data backups (daily).
**NFR-2.2:** The system shall maintain transaction logs for audit trails.
**NFR-2.3:** The system shall prevent data loss during failures.
**NFR-2.4:** The system shall validate all user inputs to prevent injection attacks.

### 6.3 Security Requirements

**NFR-3.1:** Passwords shall be hashed using bcrypt (minimum 10 rounds).
**NFR-3.2:** All communications shall use HTTPS encryption.
**NFR-3.3:** JWT tokens shall expire after 24 hours.
**NFR-3.4:** The system shall implement rate limiting (100 requests/minute per IP).
**NFR-3.5:** Sensitive data shall be encrypted at rest.
**NFR-3.6:** The system shall log all authentication attempts.
**NFR-3.7:** File uploads shall be scanned for malware.
**NFR-3.8:** The system shall implement CORS policies.

### 6.4 Software Quality Attributes

#### 6.4.1 Availability
- **Target:** 99.5% uptime
- **Downtime:** < 3.65 days per year
- **Maintenance Window:** Scheduled during low-traffic hours

#### 6.4.2 Maintainability
- **Code Quality:** Follow ESLint standards
- **Documentation:** Inline comments, API documentation
- **Modularity:** Component-based architecture
- **Version Control:** Git with semantic versioning

#### 6.4.3 Portability
- **Platform Independence:** Runs on any OS with Node.js
- **Browser Compatibility:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Responsive:** Works on devices from 320px to 4K displays

#### 6.4.4 Reliability
- **Error Handling:** Graceful degradation, user-friendly error messages
- **Data Integrity:** Validation at client and server levels
- **Fault Tolerance:** Automatic retry for failed operations

#### 6.4.5 Scalability
- **Horizontal Scaling:** Support for load balancing
- **Database Sharding:** MongoDB sharding for large datasets
- **CDN Integration:** Static assets served via CDN

#### 6.4.6 Usability
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Internationalization:** Support for English and Hindi
- **User Training:** In-app tutorials and help documentation
- **Consistency:** Uniform UI/UX across all pages

### 6.5 Business Rules

**BR-1:** Only verified students can register for events.
**BR-2:** Students can register for maximum 5 concurrent events.
**BR-3:** Event registration closes 24 hours before event start.
**BR-4:** Reports must be submitted within 7 days of event completion.
**BR-5:** Certificates are issued only for attended events.
**BR-6:** Program Officers can manage only their department's events.
**BR-7:** Minimum 75% attendance required for annual certificate.

---

## 7. Other Requirements

### 7.1 Legal Requirements

**LR-1:** Compliance with data protection regulations (GDPR-like standards).
**LR-2:** User consent for data collection and processing.
**LR-3:** Privacy policy and terms of service displayed.
**LR-4:** Right to data deletion (GDPR Article 17).
**LR-5:** Copyright notices for third-party libraries.

### 7.2 Internationalization Requirements

**IR-1:** Support for English and Hindi languages.
**IR-2:** Date/time formatting based on locale.
**IR-3:** Currency formatting (if applicable).
**IR-4:** Right-to-left (RTL) support for future languages.

### 7.3 Environmental Requirements

**ER-1:** Optimize for low bandwidth (< 2 Mbps).
**ER-2:** Minimize server resource consumption.
**ER-3:** Implement lazy loading for images.
**ER-4:** Use efficient algorithms to reduce carbon footprint.

---

## 8. Appendices

### 8.1 Glossary

| Term | Definition |
|------|------------|
| **Volunteer** | Student participating in NSS activities |
| **Event** | NSS activity or program |
| **Report** | Documentation of event participation |
| **Certificate** | Official recognition of participation |
| **Dashboard** | User's main interface after login |

### 8.2 Analysis Models

#### 8.2.1 Use Case Diagram
```
┌─────────────────────────────────────────┐
│         NSS Portal System               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Register for Event              │  │
│  │  Submit Report                   │  │
│  │  Download Certificate            │  │
│  │  View Dashboard                  │  │
│  └──────────────────────────────────┘  │
│           ▲                             │
│           │                             │
│      ┌────┴────┐                        │
│      │ Student │                        │
│      └─────────┘                        │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Create Event                    │  │
│  │  Review Reports                  │  │
│  │  Mark Attendance                 │  │
│  │  Generate Reports                │  │
│  └──────────────────────────────────┘  │
│           ▲                             │
│           │                             │
│      ┌────┴────────┐                    │
│      │ Program     │                    │
│      │ Officer     │                    │
│      └─────────────┘                    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Manage Users                    │  │
│  │  System Configuration            │  │
│  │  View Analytics                  │  │
│  └──────────────────────────────────┘  │
│           ▲                             │
│           │                             │
│      ┌────┴────┐                        │
│      │  Admin  │                        │
│      └─────────┘                        │
└─────────────────────────────────────────┘
```

#### 8.2.2 Data Flow Diagram (Level 0)
```
┌─────────┐                    ┌─────────────────┐
│ Student │───Registration────▶│                 │
└─────────┘                    │   NSS Portal    │
                               │     System      │
┌─────────┐                    │                 │
│   PO    │───Event Creation──▶│                 │
└─────────┘                    └─────────────────┘
                                       │
                                       ▼
                               ┌─────────────────┐
                               │    Database     │
                               │    (MongoDB)    │
                               └─────────────────┘
```

### 8.3 Technology Stack

#### 8.3.1 Frontend
- **Framework:** React 18+
- **State Management:** React Context API / Redux
- **Routing:** React Router v6
- **UI Library:** Tailwind CSS
- **Icons:** Heroicons
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Animations:** Anime.js (minimal usage)

#### 8.3.2 Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** MongoDB 5+
- **ODM:** Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Email:** Nodemailer
- **Validation:** Joi / Express Validator

#### 8.3.3 DevOps
- **Version Control:** Git, GitHub
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (Frontend), Render (Backend)
- **Database Hosting:** MongoDB Atlas
- **Monitoring:** PM2, New Relic (optional)

### 8.4 API Endpoints Summary

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

#### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (PO only)
- `PUT /api/events/:id` - Update event (PO only)
- `DELETE /api/events/:id` - Delete event (PO only)
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/attendance` - Mark attendance

#### Reports
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Get report details
- `POST /api/reports` - Submit report
- `PUT /api/reports/:id` - Update report
- `PUT /api/reports/:id/review` - Review report (PO only)

#### Certificates
- `GET /api/certificates` - List certificates
- `GET /api/certificates/:id` - Get certificate
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/verify/:code` - Verify certificate

#### Statistics
- `GET /api/stats/landing` - Landing page statistics
- `GET /api/stats/dashboard` - User dashboard statistics
- `GET /api/stats/admin` - Admin analytics

### 8.5 Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Nov 11, 2025 | Development Team | Initial SRS document |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | _____________ | _____________ | _______ |
| Technical Lead | _____________ | _____________ | _______ |
| NSS Coordinator | _____________ | _____________ | _______ |
| Client Representative | _____________ | _____________ | _______ |

---

**End of Document**
