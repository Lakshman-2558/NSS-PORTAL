# NSS Activity Portal

A comprehensive web-based system for managing NSS (National Service Scheme) events and student participation with an intuitive landing page.

## 🚀 Features

- **Beautiful Landing Page** with NSS branding and UEAC logo
- User authentication (Login & Signup)
- Event management for admins
- Student participation tracking
- Report submission with AI-powered insights
- Digital certificate generation
- Real-time notifications

## 🎨 Landing Page

The landing page includes:
- **Official NSS header** with government branding and social media links
- **Dynamic Image Slider** showcasing NSS activities and events
  - Auto-play functionality with pause/play control
  - Smooth transitions and navigation arrows
  - Interactive slide indicators
  - Mobile responsive
- **UEAC Logo Section** - Prominent display of University Extension Activity Council branding
- **Login and Signup** call-to-action buttons
- **Feature highlights** - Event Management, Report Submission, Digital Certificates
- **Statistics dashboard** with key metrics
- **Fully responsive design** optimized for all devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd Stack-Hack-master
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for both backend and frontend.

3. **Add Logo Images**
   - Save the NSS logo as `frontend/public/logo-nss.png`
   - Save the UEAC logo as `frontend/public/logo-ueac.png`
   - See `frontend/public/LOGO_INSTRUCTIONS.md` for details

4. **Configure environment variables**
   Create a `.env` file in the backend directory with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

## 🚀 Running the Application

### Development Mode (Both Backend & Frontend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Run Backend Only
```bash
npm run server
```

### Run Frontend Only
```bash
npm run client
```

## 🌐 Accessing the Application

Once running, you can access:
- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/register

## 📱 User Roles

1. **Admin** - Full access to manage events, participations, and reports
2. **Faculty** - Can manage events and view reports
3. **Student** - Can register for events, submit reports, and download certificates

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Material-UI (MUI)
- Lucide Icons
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time features
- Google Generative AI for report insights
- Cloudinary for image management

## 📁 Project Structure

```
Stack-Hack-master/
├── backend/              # Backend server code
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
├── frontend/            # React frontend
│   ├── public/          # Static files & logos
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── ImageSlider.jsx  # Dynamic image carousel
│   │   │   ├── Layout/
│   │   │   └── ...
│   │   ├── pages/       # Page components
│   │   │   ├── Landing.jsx  # Landing page with slider
│   │   │   ├── Auth/
│   │   │   ├── Admin/
│   │   │   ├── Faculty/
│   │   │   └── Student/
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
└── package.json         # Root package file
```

## 🎨 Customization

### Landing Page
Edit `frontend/src/pages/Landing.jsx` to customize:
- Header branding
- Hero section content
- Feature cards
- Statistics
- Color scheme (uses Tailwind utility classes)

### Image Slider
Customize the slider in `frontend/src/pages/Landing.jsx`:

```javascript
const sliderImages = [
  {
    url: 'your-image-url.jpg',
    alt: 'Image description',
    caption: 'Slide Title',
    description: 'Slide description'
  },
  // Add more slides...
];

// Usage
<ImageSlider images={sliderImages} autoPlayInterval={4000} />
```

**Slider Features:**
- Auto-play with customizable interval
- Manual navigation (previous/next arrows)
- Pause/Play button
- Slide indicators
- Responsive design
- Smooth transitions

**Component Props:**
- `images` (required): Array of image objects with url, alt, caption, description
- `autoPlayInterval` (optional): Milliseconds between auto transitions (default: 3000)

### Theme
Modify `frontend/src/theme.js` for Material-UI theme customization.

### Styles
Global styles are in `frontend/src/index.css` with TailwindCSS configuration in `frontend/tailwind.config.js`.

## 📝 Notes

- The landing page is now the default home route (`/`)
- The Navbar only appears for authenticated users
- Unauthenticated users will see the landing page without the navigation bar
- All routes except landing, login, and register require authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support and queries, please contact the development team or create an issue in the repository.

---

**Made with ❤️ for National Service Scheme**
