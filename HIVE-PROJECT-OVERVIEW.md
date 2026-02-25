# HIVE PROJECT - COMPLETE OVERVIEW

## 🎯 What is HIVE?

**HIVE** is a **local services marketplace platform** connecting customers with trusted service providers for home tasks in Sri Lanka.

### Platform Purpose:
- **For Customers:** Find and book reliable help for home tasks (cleaning, repairs, moving, etc.)
- **For Providers:** Offer services, build reputation, earn income

### Think of it as:
"Uber for Home Services" or "TaskRabbit for Sri Lanka"

---

## 🏗️ Project Architecture

### Technology Stack:

**Backend (Your Work):**
- Node.js v24.11.1
- Express.js (API framework)
- MongoDB Atlas (Cloud database)
- JWT (Authentication)
- Bcrypt (Password hashing)

**Frontend (Partner's Work):**
- HTML/CSS/JavaScript
- Glassy dark mode design
- Yellow HIVE branding
- Category-based navigation

**Development Workflow:**
1. ✅ Backend completion (You + Claude)
2. ⏳ Frontend completion (Your partner)
3. ⏳ Integration phase (Both together)

---

## 📁 Complete File Structure

```
hive-backend/
├── server.js                 # Main application entry point
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (MongoDB, JWT secret)
│
├── models/
│   ├── User.js             # User schema (customers & providers)
│   ├── Service.js          # Service listings schema
│   ├── Booking.js          # Booking/job requests schema
│   └── Review.js           # Reviews and ratings schema
│
├── routes/
│   ├── auth.js             # Authentication & user management routes
│   ├── services.js         # Service CRUD operations
│   ├── bookings.js         # Booking management
│   └── reviews.js          # Review submission and retrieval
│
├── middleware/
│   └── auth.js             # JWT authentication middleware
│
└── node_modules/           # Installed packages
```

---

## 📄 FILE-BY-FILE BREAKDOWN

### 1. **server.js** - Main Application File

**Purpose:** Entry point that starts the Express server and connects to MongoDB

**What it does:**
- Initializes Express app
- Connects to MongoDB Atlas
- Sets up middleware (CORS, JSON parsing)
- Registers all route modules
- Starts server on port 3000

**Key Code:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### 2. **models/User.js** - User Data Schema

**Purpose:** Defines the structure of user accounts in MongoDB

**Fields:**
- `name` - User's full name
- `email` - Unique email (login credential)
- `password` - Hashed password (bcrypt)
- `role` - "customer" or "provider"
- `phone` - Contact number
- `bio` - User description
- `location` - Address/city
- `profilePicture` - Image URL
- `isVerified` - Provider verification status
- `createdAt` - Registration timestamp

**Key Code:**
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider'], default: 'customer' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

---

### 3. **models/Service.js** - Service Listings Schema

**Purpose:** Defines service offerings created by providers

**Fields:**
- `title` - Service name (e.g., "Professional House Cleaning")
- `description` - Detailed description
- `category` - One of 15 categories (Plumbing, Electrical, etc.)
- `price` - Service cost in LKR
- `location` - Service area
- `providerId` - Reference to User (provider)
- `images` - Array of image URLs
- `availability` - Provider's available times
- `createdAt` - Listing timestamp

**15 Service Categories:**
1. Plumbing
2. Electrical
3. Carpentry
4. Painting
5. Cleaning
6. Home Repairs
7. Appliance Repair
8. Pest Control
9. Landscaping
10. Moving & Packing
11. AC Service
12. Interior Design
13. Masonry
14. Roofing
15. General Handyman

**Key Code:**
```javascript
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Plumbing', 'Electrical', 'Carpentry', ...] 
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
  availability: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

---

### 4. **models/Booking.js** - Booking/Job Requests Schema

**Purpose:** Tracks service bookings and their status

**Fields:**
- `serviceId` - Reference to Service
- `customerId` - Reference to User (customer)
- `providerId` - Reference to User (provider)
- `status` - pending → confirmed → in-progress → completed → cancelled
- `bookingDate` - Scheduled date/time
- `totalPrice` - Final price
- `notes` - Customer instructions
- `createdAt` - Booking timestamp

**Booking Lifecycle:**
1. **pending** - Customer created booking
2. **confirmed** - Provider accepted
3. **in-progress** - Work started
4. **completed** - Job finished
5. **cancelled** - Either party cancelled

**Key Code:**
```javascript
const bookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending' 
  },
  bookingDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

---

### 5. **models/Review.js** - Reviews and Ratings Schema

**Purpose:** Allows customers to rate and review completed services

**Fields:**
- `serviceId` - Reference to Service
- `customerId` - Reference to User (reviewer)
- `providerId` - Reference to User (provider being reviewed)
- `rating` - 1-5 stars
- `comment` - Written review
- `createdAt` - Review timestamp

**Key Code:**
```javascript
const reviewSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

---

### 6. **routes/auth.js** - Authentication & User Management

**Purpose:** Handles user registration, login, profile management, password operations

**Endpoints:**

#### **Public Routes (No Authentication Required):**

1. **POST /api/auth/register** - Create new account
   - Input: name, email, password, role
   - Output: JWT token, user data
   - Hashes password with bcrypt

2. **POST /api/auth/login** - Login existing user
   - Input: email, password
   - Output: JWT token, user data
   - Validates credentials

3. **POST /api/auth/forgot-password** - Request password reset
   - Input: email
   - Output: Reset token (currently in response, will be emailed in production)
   - Generates JWT reset token (1 hour expiry)

4. **POST /api/auth/reset-password** - Reset password with token
   - Input: resetToken, newPassword
   - Output: Success message
   - Validates token and updates password

#### **Protected Routes (JWT Authentication Required):**

5. **GET /api/auth/profile** - Get current user profile
   - Output: User data (password excluded)
   - Uses JWT to identify user

6. **PUT /api/auth/profile** - Update user profile
   - Input: name, email, phone, bio, location (all optional)
   - Output: Updated user data
   - Validates email uniqueness if changed

7. **PUT /api/auth/change-password** - Change password
   - Input: currentPassword, newPassword
   - Output: Success message
   - Validates current password before changing

8. **DELETE /api/auth/account** - Delete user account
   - Input: password (confirmation)
   - Output: Success message
   - **Cascading deletes:**
     - User's services (if provider)
     - User's bookings
     - User's reviews

**Security Features:**
- Bcrypt password hashing (10 salt rounds)
- JWT tokens (30-day expiry for auth, 1-hour for reset)
- Password confirmation for account deletion
- Current password validation for password changes

---

### 7. **routes/services.js** - Service CRUD Operations

**Purpose:** Manage service listings (create, read, update, delete)

**Endpoints:**

1. **GET /api/services** - List all services (with filters)
   - Query params: category, location, minPrice, maxPrice
   - Output: Array of services with provider details
   - Public access

2. **GET /api/services/:id** - Get single service details
   - Output: Service data with provider info
   - Public access

3. **POST /api/services** - Create new service (Provider only)
   - Input: title, description, category, price, location, images, availability
   - Output: Created service
   - Requires authentication + provider role

4. **PUT /api/services/:id** - Update service (Owner only)
   - Input: Any service fields to update
   - Output: Updated service
   - Only the provider who created it can update

5. **DELETE /api/services/:id** - Delete service (Owner only)
   - Output: Success message
   - Only the provider who created it can delete

**Features:**
- Category filtering
- Location-based search
- Price range filtering
- Provider authentication
- Ownership validation

---

### 8. **routes/bookings.js** - Booking Management

**Purpose:** Handle service bookings and status updates

**Endpoints:**

1. **GET /api/bookings** - Get user's bookings
   - Query params: status (pending, confirmed, etc.)
   - Output: Bookings as customer OR as provider
   - Shows different data based on user role

2. **GET /api/bookings/:id** - Get single booking details
   - Output: Booking with service and user details
   - Only customer or provider of that booking can view

3. **POST /api/bookings** - Create new booking (Customer only)
   - Input: serviceId, bookingDate, notes
   - Output: Created booking
   - Automatically calculates totalPrice from service

4. **PUT /api/bookings/:id** - Update booking status
   - Input: status (confirmed, in-progress, completed, cancelled)
   - Output: Updated booking
   - Only customer or provider can update

5. **DELETE /api/bookings/:id** - Cancel/delete booking
   - Output: Success message
   - Only customer or provider can delete

**Status Workflow:**
```
pending → confirmed → in-progress → completed
   ↓
cancelled
```

---

### 9. **routes/reviews.js** - Review System

**Purpose:** Allow customers to review completed services

**Endpoints:**

1. **GET /api/reviews/service/:serviceId** - Get reviews for a service
   - Output: Array of reviews with customer details
   - Public access

2. **POST /api/reviews** - Submit a review (Customer only)
   - Input: serviceId, providerId, rating (1-5), comment
   - Output: Created review
   - Only customers can submit reviews

**Features:**
- 1-5 star rating system
- Written comments
- Linked to specific service and provider
- Customer authentication required

---

### 10. **middleware/auth.js** - JWT Authentication Middleware

**Purpose:** Protect routes and verify user identity

**Functions:**

1. **exports.protect** - Main authentication middleware
   - Extracts JWT from Authorization header
   - Verifies token with JWT_SECRET
   - Attaches user data to `req.user`
   - Used in protected routes

2. **exports.isProvider** - Provider role check
   - Ensures user has "provider" role
   - Used for provider-only actions

3. **exports.isCustomer** - Customer role check
   - Ensures user has "customer" role
   - Used for customer-only actions

**Usage Example:**
```javascript
// In routes file
const { protect } = require('../middleware/auth');

// Protected route
router.get('/profile', protect, async (req, res) => {
  // req.user is available here
});
```

---

### 11. **.env** - Environment Variables

**Purpose:** Store sensitive configuration (NOT committed to Git)

**Required Variables:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hive
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

**Security Note:**
- NEVER share .env file
- NEVER commit to Git
- Each developer has their own .env

---

### 12. **package.json** - Project Dependencies

**Purpose:** Lists all npm packages and project metadata

**Key Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.2",           // Web framework
    "mongoose": "^8.0.0",           // MongoDB ODM
    "bcryptjs": "^2.4.3",           // Password hashing
    "jsonwebtoken": "^9.0.2",       // JWT authentication
    "dotenv": "^16.3.1",            // Environment variables
    "cors": "^2.8.5"                // Cross-origin requests
  }
}
```

**Scripts:**
```json
{
  "scripts": {
    "start": "node server.js",      // Start production server
    "dev": "nodemon server.js"      // Development with auto-restart
  }
}
```

---

## 🔐 Security Implementation

### 1. **Password Security:**
- Bcrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Password fields excluded from API responses

### 2. **JWT Authentication:**
- Token-based authentication
- 30-day token expiry (configurable)
- Tokens include user ID and role
- Middleware validates on every protected request

### 3. **Authorization:**
- Role-based access control (customer/provider)
- Ownership validation (users can only modify their own data)
- Protected routes require valid JWT

### 4. **Data Validation:**
- Email uniqueness enforced
- Required fields validated
- Enum constraints on status/category fields
- Password length requirements (min 6 characters)

---

## 🧪 Testing & Validation

### All Features Tested in Postman:

**✅ Authentication:**
- [x] User registration
- [x] User login
- [x] Get profile
- [x] Update profile
- [x] Change password
- [x] Forgot password
- [x] Reset password
- [x] Delete account

**✅ Services:**
- [x] Create service (provider)
- [x] List all services
- [x] Get single service
- [x] Filter by category
- [x] Filter by location
- [x] Filter by price
- [x] Update service
- [x] Delete service

**✅ Bookings:**
- [x] Create booking (customer)
- [x] List bookings
- [x] Update booking status
- [x] Cancel booking

**✅ Reviews:**
- [x] Submit review (customer)
- [x] Get service reviews

---

## 📊 Database Schema Relationships

```
User (Customer/Provider)
  ↓
  ├─→ Services (one-to-many) - Provider creates multiple services
  ├─→ Bookings (one-to-many) - User has multiple bookings
  └─→ Reviews (one-to-many) - Customer writes multiple reviews

Service
  ↓
  ├─→ Bookings (one-to-many) - Service can have multiple bookings
  └─→ Reviews (one-to-many) - Service can have multiple reviews

Booking
  ├─→ Service (many-to-one)
  ├─→ Customer (many-to-one)
  └─→ Provider (many-to-one)

Review
  ├─→ Service (many-to-one)
  ├─→ Customer (many-to-one)
  └─→ Provider (many-to-one)
```

---

## 🚀 Current Status & Next Steps

### ✅ Completed Features:
1. User authentication (register, login)
2. Profile management (view, update, delete)
3. Password management (change, reset)
4. Service CRUD (create, read, update, delete)
5. Service filtering (category, location, price)
6. Booking management (create, update status, cancel)
7. Review system (submit, view)
8. Role-based access control
9. JWT authentication
10. Data validation
11. Cascading deletes

### ⏳ In Progress:
- **Image Upload** - Profile pictures & service photos (NEXT)

### ❌ Pending Features:
1. **Image Upload** (Starting now)
2. Email sending (forgot password emails)
3. Payment integration (Stripe/PayPal)
4. Messaging system (customer ↔ provider chat)
5. Notifications (email/push)
6. Provider stats (earnings, rating average)
7. Search improvements
8. Provider verification badge
9. Admin panel
10. Deployment (Render/Railway/Heroku)

---

## 📱 Frontend Status (Partner's Work)

**Completed:**
- Landing page with HIVE branding
- Dark mode glassy design
- Category icons (15 categories)
- Service request cards
- Toggle: "Looking for service" / "Providing service"
- Footer sections

**In Progress:**
- Login page
- Post Job form (customer)
- Post Service form (provider)
- Dashboards (customer & provider)

**Pending:**
- Integration with backend API
- Profile pages
- Booking management UI
- Review submission UI

---

## 🎯 Project Goals

### MVP (Minimum Viable Product):
- Customers can find and book services
- Providers can list services and accept bookings
- Reviews and ratings system
- Basic authentication and profiles

### Future Enhancements:
- In-app payments
- Real-time messaging
- Provider verification
- Advanced search (geolocation)
- Mobile app (React Native)
- Admin dashboard

---

## 📞 API Base URLs

**Development:**
```
http://localhost:3000/api
```

**Production (After Deployment):**
```
https://hive-api.onrender.com/api  (or similar)
```

---

## 👥 Team Roles

**You (Backend Developer):**
- API development
- Database design
- Authentication & security
- Business logic
- Testing

**Partner (Frontend Developer):**
- User interface design
- Frontend components
- User experience
- Responsive design

**Together (Integration Phase):**
- Connect frontend to API
- End-to-end testing
- Bug fixes
- Deployment

---

## 🛠️ Development Environment

**Your Setup:**
- macOS
- Node.js v24.11.1
- VS Code
- MongoDB Atlas (cloud database)
- Postman (API testing)
- Terminal

**Project Location:**
```
~/Desktop/hive-backend/
```

**Server:**
- Port: 3000
- MongoDB: Cloud (Atlas)

---

## 📚 Resources & Documentation

1. **HIVE-API-DOCUMENTATION.md** - Complete API reference
2. **USER-MANAGEMENT-TESTING-GUIDE.md** - Testing instructions
3. This document - Project overview

---

## 🎓 Key Learning Points

**Technologies Learned:**
1. Node.js backend development
2. Express.js API design
3. MongoDB database modeling
4. JWT authentication
5. RESTful API principles
6. Password security (bcrypt)
7. Middleware concepts
8. Error handling
9. API testing with Postman

**Best Practices Implemented:**
1. Environment variables for secrets
2. Password hashing
3. Token-based authentication
4. Input validation
5. Error handling
6. RESTful naming conventions
7. Separation of concerns (routes, models, middleware)
8. Database relationships
9. Cascading deletes

---

## 🏆 What Makes HIVE Special

1. **Local Focus** - Built for Sri Lankan market
2. **Dual-sided Marketplace** - Serves both customers and providers
3. **Category Variety** - 15 different service types
4. **Trust System** - Reviews and ratings
5. **Simple Booking** - Easy service discovery and booking
6. **Secure** - Proper authentication and authorization
7. **Scalable** - Can grow to thousands of users

---

## 💡 Next Immediate Steps

1. **Install image upload packages** (multer, cloudinary)
2. **Set up Cloudinary account** (free)
3. **Add image upload routes**
4. **Test image uploads**
5. **Update documentation**

---

**End of Project Overview**

Created: December 2025
Last Updated: December 2025
Version: 1.0
Status: Backend Development Phase
