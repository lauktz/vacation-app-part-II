# 🌴 Vacation Management System

A full-stack vacation management application built with **React** (frontend) and **Flask** (backend). Users can browse, like, and filter vacations, while admins can manage vacation listings, countries, and users.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [User Credentials](#user-credentials)
- [Screenshots](#screenshots)
- [Project Requirements](#project-requirements)

---

## ✨ Features

### 👤 User Features
- **Browse Vacations**: View all available vacation packages with images, descriptions, prices, and dates
- **Search & Filter**: 
  - Search by destination or description
  - Filter by price range (slider)
  - Filter by category (Culture, Adventure, Nature, Food & Wine, Urban, Travel)
  - Show only liked vacations
- **Like System**: Like/unlike vacations and see total likes per vacation
- **Responsive Design**: Beautiful, modern UI with Material-UI components
- **Authentication**: Secure login/register with JWT tokens
- **Auto-complete Credentials**: Browser password manager support

### 👨‍💼 Admin Features
- **Vacation Management**: 
  - Add new vacations with image upload or URL
  - Edit existing vacations
  - Delete vacations with confirmation
- **Country Management**: Add new countries on-the-fly
- **Admin Dashboard**: Special navigation for admin operations
- **Real-time Updates**: Changes reflect immediately across the system

### 🎨 UI/UX Features
- Clean, modern design with gradient backgrounds
- Hover effects and smooth transitions
- Category-based icons for each vacation type
- Responsive grid layout (3 vacations per row on desktop)
- Image optimization and fallback handling
- Dynamic filtering with instant results

---

## 🛠️ Tech Stack

### Frontend (React Application)
- **React 18** - Modern UI library with hooks
- **Vite 7.1** - Fast build tool and dev server with HMR (Hot Module Replacement)
- **Material-UI (MUI) v6** - Comprehensive component library
  - Box, Card, TextField, Button, Grid, Slider, Select, Chip, etc.
  - Icons: Material Icons (Favorite, Search, BeachAccess, etc.)
- **React Router v6** - Declarative client-side routing
  - Routes: Home, Vacations, Login, Register, About, Add/Edit Vacation
- **Context API** - Global state management for authentication
  - UserProvider/useUser hook for auth state
- **Fetch API** - HTTP requests to Flask backend
  - Service layer with dedicated API modules (apiVacations, apiCountries, apiLikes)
- **CSS Modules** - Scoped component styling
- **FormData API** - File uploads for vacation images

### Backend (Flask REST API)
- **Python 3.13** - Programming language
- **Flask 3.1.1** - Lightweight web framework
- **SQLite** - File-based relational database (alternative to MySQL)
- **Flask-CORS 4.0** - Cross-origin resource sharing for React integration
- **PyJWT 2.8** - JSON Web Token authentication
- **Werkzeug 3.1** - Password hashing (pbkdf2:sha256)
- **Blueprint Architecture** - Modular route organization

### Architecture Patterns
- **Layered Architecture**: 
  - Models (Data Access Layer)
  - Controllers (Business Logic Layer)
  - Routes (Presentation/API Layer)
- **RESTful API Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JWT Authentication**: Stateless token-based auth
- **Role-based Access Control (RBAC)**: Admin vs User permissions

---

## 📁 Project Structure

```
React-Python-Flask-Vacation-Project-master/
├── vacation-app-part-I-main/          # Backend (Flask)
│   ├── app.py                         # Main Flask application
│   ├── my_vacations_db.db            # SQLite database
│   ├── requirements.txt              # Python dependencies
│   ├── seed_data.py                  # Database seeding script
│   ├── auth_decorator.py             # JWT authentication decorators
│   ├── env_config.py                 # Environment configuration
│   ├── models/                       # Database models
│   │   ├── user_model.py
│   │   ├── vacation_model.py
│   │   ├── country_model.py
│   │   ├── like_model.py
│   │   └── role_model.py
│   ├── controllers/                  # Business logic
│   │   ├── user_controller.py
│   │   ├── vacation_controller.py
│   │   ├── country_controller.py
│   │   └── like_controller.py
│   ├── routes/                       # API routes (Blueprints)
│   │   ├── user_routes.py
│   │   ├── vacation_routes.py
│   │   ├── countries_route.py
│   │   └── like_routes.py
│   └── images/                       # Vacation images
│
├── react-app/my-app-v3-token/        # Frontend (React)
│   ├── src/
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   ├── components/               # Reusable components
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── NavBar/
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Vacations.jsx
│   │   │   ├── AddVacation.jsx
│   │   │   ├── EditVacation.jsx
│   │   │   └── About.jsx
│   │   ├── contexts/                 # Context providers
│   │   │   └── Context.jsx
│   │   └── api/                      # API service layer
│   │       ├── api.js
│   │       ├── apiVacations.js
│   │       ├── apiCountries.js
│   │       ├── apiLikes.js
│   │       └── apiLikesCount.js
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Python 3.9+**
- **Node.js 16+** and npm
- **Git**

### Backend Setup (Flask)

1. **Navigate to backend directory:**
   ```bash
   cd vacation-app-part-I-main
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python3 app.py
   ```
   Server will run on: `http://localhost:5003`

5. **Seed the database (first time only):**
   ```bash
   python3 seed_data.py
   ```

### Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**
   ```bash
   cd react-app/my-app-v3-token
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install:
   - React 18.3
   - React Router DOM 7.1
   - Material-UI (MUI) v6
   - Vite 7.1
   - And all other dependencies from `package.json`

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   - App will run on: `http://localhost:5174` (or 5173)
   - Vite provides Hot Module Replacement (HMR) for instant updates
   - The app will automatically open in your browser

4. **Build for production (optional):**
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `dist/` folder

---

## ⚛️ React Application Details

### Component Architecture

#### Pages
- **Home.jsx** - Landing page with hero section and call-to-action
- **Vacations.jsx** - Main vacation browsing page with filters and search
- **AddVacation.jsx** - Admin form to create new vacations
- **EditVacation.jsx** - Admin page to edit/delete vacations
- **About.jsx** - Team information and photo gallery

#### Components
- **NavBar.jsx** - Navigation bar with role-based menu items
- **Login.jsx** - User authentication form
- **Register.jsx** - User registration form

#### Context
- **Context.jsx** - Global authentication state using React Context API
  - Manages: user, token, isAuthenticated, isAdmin, isUser
  - Functions: login, logout, register, updateUser
  - Persists auth state in localStorage

#### API Service Layer
- **api.js** - Core API utilities (auth headers, login, register, image upload)
- **apiVacations.js** - Vacation CRUD operations
- **apiCountries.js** - Country operations
- **apiLikes.js** - Like/unlike operations
- **apiLikesCount.js** - Get likes count for vacations

### Key Features Implementation

#### Advanced Filtering System
The Vacations page includes multiple filters that work together:
1. **Text Search** - Searches in destination and description fields
2. **Price Range Slider** - Dynamic price filtering ($0-$5000)
3. **Category Filter** - Automatically categorizes vacations based on keywords:
   - 🏛️ Culture (cultural, art, history, museum, temples)
   - 🏔️ Adventure (hiking, adventure, explore, trekking)
   - 🏖️ Nature (beach, island, coastal, relaxation)
   - 🍷 Food & Wine (wine, food, tasting, culinary)
   - ✈️ Urban (night market, city, urban)
   - ✈️ Travel (default category)
4. **Liked Vacations** - Toggle to show only vacations with likes

#### Image Handling
- **Upload**: Admin can upload images via file input
- **URL Support**: Can also use external image URLs
- **Fallback**: Placeholder image if image fails to load
- **Local Storage**: Images stored in `/vacation-app-part-I-main/images/`
- **Serving**: Flask serves images via `/images/:filename` endpoint

#### Authentication Flow
1. User submits login credentials
2. Backend validates and returns JWT token + user object
3. Frontend stores token and user in localStorage
4. Token included in Authorization header for protected routes
5. Auto-logout on token expiration or invalid token

#### Role-based UI
- **Admin**: Sees "Add Vacation" and "Edit Vacation" buttons in navbar
- **User**: Sees like/unlike buttons on vacation cards
- **Guest**: Can browse vacations but cannot like or manage them

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |

### Vacations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/vacations` | Get all vacations | ❌ |
| GET | `/vacations/:id` | Get vacation by ID | ❌ |
| POST | `/vacations` | Create vacation | ✅ Admin |
| PUT | `/vacations/:id` | Update vacation | ✅ Admin |
| DELETE | `/vacations/:id` | Delete vacation | ✅ Admin |

### Countries
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/countries` | Get all countries | ❌ |
| POST | `/countries` | Add new country | ✅ Admin |

### Likes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/likes` | Like a vacation | ✅ User |
| DELETE | `/likes` | Unlike a vacation | ✅ User |
| GET | `/likes/:user_id` | Get user's liked vacations | ✅ |
| GET | `/likes/counts` | Get likes count for all vacations | ❌ |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | ✅ Admin |
| GET | `/users/:id` | Get user by ID | ✅ Admin |
| PUT | `/users/:id` | Update user | ✅ Admin |
| DELETE | `/users/:id` | Delete user | ✅ Admin |

### Images
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/images/:filename` | Get vacation image | ❌ |
| POST | `/upload-image` | Upload new image | ✅ Admin |

---

## 🔑 User Credentials

### Admin User
- **Email:** `laura-admin@johnbryce.com`
- **Password:** `@dmin!77`
- **Permissions:** Full access to manage vacations, countries, and users

### Regular User
- **Email:** `ckent@gmail.com`
- **Password:** `mypass!!word9`
- **Permissions:** View and like vacations

> **Note:** You can register new users through the app. Admins must be created via seed script or database.

---

## 📸 Screenshots

### Home Page
Beautiful landing page with hero section and call-to-action

### Vacations Page
Grid layout with:
- Search bar for filtering by destination/description
- Price range slider
- Category filter (Culture, Adventure, Nature, etc.)
- Like/unlike functionality (users only)
- Category icons for each vacation

### Admin Features
- Add Vacation: Form with image upload or URL input
- Edit Vacation: Inline editing with all fields
- Country Management: Add new countries on-the-fly

---

## 📝 Project Requirements

### Database Schema

#### Users Table
- `user_id` (PK, Auto-increment)
- `first_name`
- `last_name`
- `email` (unique)
- `password` (hashed)
- `role_id` (FK to Roles)

#### Roles Table
- `role_id` (PK)
- `role_name` (Admin/User)

#### Vacations Table
- `vacation_id` (PK, Auto-increment)
- `country_id` (FK to Countries)
- `destination`
- `description`
- `start_date`
- `end_date`
- `price`
- `image_filename`

#### Countries Table
- `country_id` (PK, Auto-increment)
- `country_name` (unique)

#### Likes Table
- `user_id` (FK to Users)
- `vacation_id` (FK to Vacations)
- Composite PK: (user_id, vacation_id)

### Business Rules
1. **Authentication:**
   - JWT-based authentication
   - Tokens expire after 1 hour
   - Admin and User roles

2. **Vacations:**
   - Start date must be today or later (for new vacations)
   - End date must be after start date
   - Price range: $0 - $10,000
   - Images stored locally or via URL

3. **Likes:**
   - Users can like/unlike vacations
   - One like per user per vacation
   - Likes count visible to all

4. **Admin Features:**
   - Only admins can create/edit/delete vacations
   - Only admins can add new countries
   - Admins cannot like vacations

---

## 🔒 Security Features

- **Password Hashing**: Using Werkzeug's pbkdf2:sha256
- **JWT Tokens**: Secure authentication with expiration
- **Role-based Access Control**: Admin vs User permissions
- **Input Validation**: Both frontend and backend validation
- **CORS Protection**: Configured for local development
- **SQL Injection Prevention**: Parameterized queries

---

## 🎨 Design Decisions

1. **Material-UI**: Chosen for consistent, professional design
2. **Context API**: Simple state management for auth
3. **Layered Architecture**: Separation of concerns (Models → Controllers → Routes)
4. **SQLite**: Lightweight database perfect for development
5. **Vite**: Fast build tool with hot module replacement
6. **Category System**: Dynamic icons based on vacation description

---

## 🐛 Known Issues & Limitations

- Database resets when server restarts (development only)
- Images must be manually added to `/images` folder or uploaded
- No pagination for large datasets
- Browser refresh required after external updates (Postman)

---

## 🚀 Future Enhancements

- [ ] Real-time updates using WebSockets
- [ ] Pagination for vacations list
- [ ] Advanced search with multiple filters
- [ ] Vacation booking system
- [ ] Email notifications
- [ ] Payment integration
- [ ] Admin analytics dashboard
- [ ] Image compression and optimization
- [ ] Multi-language support
- [ ] Dark mode

---

## 📄 License

This project is part of the John Bryce Full Stack Development course (2025).

---

## 👥 Contributors

- **Laura Katz** - Full Stack Developer
- **Liam Ben David** - Full Stack Developer

---

## 🙏 Acknowledgments

- John Bryce Academy for the course structure
- Material-UI team for the component library
- Flask community for excellent documentation

---

## 📞 Support

For questions or issues, please contact:
- Email: laura-admin@johnbryce.com
- GitHub: [Your GitHub Profile]

---

**Built with ❤️ using React and Flask**

