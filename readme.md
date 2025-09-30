# Contact Management System

A production-ready full-stack contact management application featuring global phone number deduplication and per-user contact aliasing. Built with MongoDB Atlas, Node.js, Express, React, and TypeScript.

## Overview

This system allows multiple users to maintain personal address books while ensuring efficient storage through global phone number deduplication. Each user can assign custom names (aliases) to contacts, enabling different users to save the same phone number under different names without data duplication.

### Key Features

- **Global Phone Deduplication**: One phone number stored once, regardless of how many users save it
- **Per-User Aliasing**: Each user sees their own custom name for contacts
- **Smart Search**: Search by name (per-user) or phone number (global)
- **MongoDB Atlas Integration**: Cloud-hosted database with automatic backups
- **Secure Authentication**: JWT-based stateless authentication
- **Phone Normalization**: Automatic formatting to international standard
- **Transaction Safety**: ACID-compliant operations for data consistency
- **RESTful API**: Clean, documented API endpoints

### Example Use Case
User A saves: "Simon" - 01534629987
User B saves: "Milar" - 01534629987
Database stores: ONE contact (01534629987)
User A sees: "Simon - 01534629987"
User B sees: "Milar - 01534629987"

---



## Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui design
- **Icons**: Hero icon
- **Validation**: Yup


---

## Project Structure
contact-management-system/
├── README.md                      # This file
├── API_DOCUMENTATION.md           # API specification
├── SOLUTION_BREAKDOWN.md          # Technical write-up
├── INSTALLATION.md                # Setup instructions
├── .gitignore                     # Git ignore rules
│
├── backend-sol/                   # Backend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/            # Configuration files
│   │   │   ├── errors/            # Error handling
│   │   │   ├── interface/         # TypeScript interfaces
│   │   │   ├── middlewares/       # Express middlewares
│   │   │   ├── modules/
│   │   │   │   ├── Auth/          # Authentication module
│   │   │   │   ├── User/          # User management
│   │   │   │   ├── Profile/       # User profiles
│   │   │   │   ├── Contact/       # Global contacts
│   │   │   │   └── UserContact/   # User-contact links
│   │   │   ├── routes/            # Route definitions
│   │   │   └── utils/             # Utility functions
│   │   ├── app.ts                 # Express app setup
│   │   └── server.ts              # Server entry point
│   ├── .env                       # Environment variables
│   ├── package.json               # Dependencies
│   └── tsconfig.json              # TypeScript config
│
└── frontend-sol/                  # Frontend application
├── src/
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── common/            # Common components
│   │   └── forms/             # Form components
│   ├── features/
│   │   ├── auth/              # Authentication pages
│   │   ├── contacts/          # Contact management
│   │   └── profile/           # Profile management
│   ├── layouts/               # Layout components
│   ├── store/
│   │   ├── slices/            # Redux slices
│   │   └── api/               # RTK Query APIs
│   ├── types/                 # TypeScript types
│   ├── lib/                   # Utilities
│   ├── App.tsx                # Root component
│   └── main.tsx               # Entry point
├── .env                       # Environment variables
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
└── tailwind.config.js         # Tailwind config

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 8+
- MongoDB Atlas account (free tier)

### Backend Setup
```bash
cd backend-sol
npm install
npm run dev
Backend runs at: http://localhost:8000
Frontend Setup
bashcd frontend-sol
npm install
npm run dev
Frontend runs at: http://localhost:5173
For detailed setup instructions, see INSTALLATION.md

Database Schema
Collections
1. users
Authentication and account data
javascript{
  email: String (unique),
  password: String (hashed),
  profileId: ObjectId (ref: Profile),
  status: 'active' | 'blocked',
  isDeleted: Boolean
}
2. profiles
User profile information
javascript{
  userId: ObjectId (ref: User, unique),
  firstName: String,
  lastName: String,
  otherEmails: [String],
  contacts: [{ phoneNumber, alias }]  // Initial import only
}]
3. contacts
Global phone number storage
javascript{
  phoneNumber: String,
  normalizedPhone: String (unique),  // +8801534629987
  createdAt: Date
}
4. usercontacts
User-specific contact links
javascript{
  userId: ObjectId (ref: User),
  contactId: ObjectId (ref: Contact),
  alias: String,              // User's custom name
  labels: [String],
  notes: String,
  // Unique compound index on (userId, contactId)
}

API Endpoints
Authentication

POST /api/v1/auth/register - Register new user
POST /api/v1/auth/login - User login
POST /api/v1/auth/change-password - Change password

Profile

GET /api/v1/profile/me - Get user profile
PATCH /api/v1/profile/me - Update profile

Contacts

GET /api/v1/contacts - List all contacts (paginated)
POST /api/v1/contacts - Add new contact
PATCH /api/v1/contacts/:id - Update contact
DELETE /api/v1/contacts/:id - Delete contact
GET /api/v1/contacts/search - Search contacts

For complete API documentation, see API_DOCUMENTATION.md

Key Features Explained
1. Global Deduplication
When multiple users save the same phone number:

Only ONE record created in contacts collection
Each user gets their own usercontacts record
Each user sees their own custom alias

2. Phone Normalization
All phone numbers are normalized to E.164 format:
Input: 01534629987
Output: +8801534629987

Input: 0 1534 629 987
Output: +8801534629987
3. Search Functionality

Search by Name: Returns only your contacts matching the name
Search by Phone: Finds contacts globally but shows your alias
Flexible Matching: Case-insensitive, partial matches supported

4. Security

Passwords hashed with bcrypt (12 rounds)
JWT authentication with 7-day expiry
Protected routes require valid tokens
User data isolated (can't access other users' aliases)


Environment Variables
Backend (.env)
envNODE_ENV=development
PORT=8000
DATABASE_URL=mongodb+srv://...
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-key
JWT_REFRESH_EXPIRES_IN=30d
Frontend (.env)
envVITE_API_URL=http://localhost:8000/api/v1

Available Scripts
Backend
bashnpm run dev          # Development server with auto-reload
npm run build        # Compile TypeScript
npm start            # Production server
npm run lint         # Code linting
Frontend
bashnpm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Code linting

Testing
Manual Testing

Register a new user via frontend
Add contacts with different phone numbers
Register second user
Add same phone number with different alias
Verify both users see their own aliases
Test search functionality

API Testing (Postman/cURL)
bash# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

Database Indexes
Optimized for query performance:
CollectionIndex Purposeusers{ email: 1 }Login queriesprofiles{ userId: 1 }Profile lookupcontacts{ normalizedPhone: 1 }Deduplication (unique)usercontacts{ userId: 1, contactId: 1 }Prevent duplicates (unique)usercontacts{ userId: 1, alias: 1 }Name searchusercontacts{ userId: 1, createdAt: -1 }Sorted listing


I've added you as a collaborator to my GitHub repository: contact-management-system

 Please check your email (including spam folder) for a GitHub invitation from "Rakibhasaniu"

 The invitation email subject will be something like:
"You've been invited to collaborate on Rakibhasaniu/contact-management"

 Repository URL: https://github.com/Rakibhasaniu/contact-management

 Please accept the invitation so you can access the code!