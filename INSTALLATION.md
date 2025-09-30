Contact Management System - Installation & Running Instructions

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 16.x or higher
  - Check: `node --version`
  - Download: https://nodejs.org/

- **npm**: Version 8.x or higher (comes with Node.js)
  - Check: `npm --version`

- **Git**: For cloning the repository
  - Check: `git --version`
  - Download: https://git-scm.com/

- **MongoDB Atlas Account**: Required (no local MongoDB)
  - Create account: https://www.mongodb.com/products/platform/atlas-database

---

## Part 1: MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/products/platform/atlas-database
2. Click "Try Free"
3. Sign up using email or Google account
4. Verify your email address

### Step 2: Create a Database Cluster
1. After login, click **"Build a Database"**
2. Choose **M0 (Free tier)**
3. Select provider: **AWS**
4. Select region: Choose closest to your location (e.g., `ap-south-1` for Asia)
5. Cluster Name: `contact-management`
6. Click **"Create"**
7. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Select **"Password"** authentication method
4. Username: `contactapp`
5. Click **"Autogenerate Secure Password"**
6. **IMPORTANT**: Copy and save this password
7. Database User Privileges: Select **"Read and write to any database"**
8. Click **"Add User"**

### Step 4: Configure Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. IP Address will be: `0.0.0.0/0`
5. Click **"Confirm"**

### Step 5: Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Driver: **Node.js**
5. Version: **4.1 or later**
6. Copy the connection string (looks like):
mongodb+srv://contactapp:<password>@contact-management.xxxxx.mongodb.net/?retryWrites=true&w=majority
7. Replace `<password>` with the password you copied in Step 3
8. Add database name before the `?`:
mongodb+srv://contactapp:YOUR_PASSWORD@contact-management.xxxxx.mongodb.net/contact-management?retryWrites=true&w=majority

---

## Part 2: Backend Setup & Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/contact-management-system.git
cd contact-management-system
Step 2: Navigate to Backend Directory
bashcd backend-sol
Step 3: Install Dependencies
bashnpm install
This will install all required packages listed in package.json. Wait for completion (2-3 minutes).
Step 4: Configure Environment Variables
Open the .env file in backend-sol/ directory and update:
envNODE_ENV=development
PORT=8000
DATABASE_URL=mongodb+srv://contactapp:YOUR_PASSWORD@contact-management.xxxxx.mongodb.net/contact-management?retryWrites=true&w=majority
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=a8f5e2d1c3b7a9e4f8d2c1b5a7e9f3d8c2b1a5e7f9d3c8b2a1e5f7d9c3b8a2e1
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=b9g6f3e2d4c8b0f5g9e3d2c6b8f0g4e9d3c7b1f6g0e4d8c3b2f7g1e5d9c4b3f2
JWT_REFRESH_EXPIRES_IN=30d
IMPORTANT: Replace the DATABASE_URL with your actual MongoDB Atlas connection string from Part 1, Step 5.
Step 5: Start Backend Server (Development Mode)
bashnpm run dev
Expected Output:
Database connected successfully
Server is running on port 8000
Backend is now running at: http://localhost:8000
Step 6: Verify Backend is Working
Open another terminal and test:
bashcurl http://localhost:8000
Expected Response:
Contact Management System Server is running!

Part 3: Frontend Setup & Installation
Step 1: Open New Terminal
Keep the backend running in the first terminal. Open a new terminal window.
Step 2: Navigate to Frontend Directory
bashcd contact-management-system/frontend-sol
Step 3: Install Dependencies
bashnpm install
This will install all required packages (3-4 minutes).
Step 4: Configure Environment Variables
The .env file in frontend-sol/ should already contain:
envVITE_API_URL=http://localhost:8000/api/v1
No changes needed if running locally. If deploying to production, update the URL.
Step 5: Start Frontend Server (Development Mode)
bashnpm run dev
Expected Output:
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
Frontend is now running at: http://localhost:5173
Step 6: Access the Application
Open your web browser and go to:
http://localhost:5173
You should see the Contact Management System login page.

Part 4: Testing the Application
Test 1: Register a New User

Open browser: http://localhost:5173
Click "Register" link
Fill in the form:

Email: test@example.com
Password: password123
First Name: Test
Last Name: User


Click "Register"
You should be redirected to contacts page

Test 2: Add a Contact

Click "Add Contact" button
Fill in:

Phone Number: 01534629987
Name: John Doe
Labels: friend, work


Click "Add Contact"
Contact should appear in the table

Test 3: Search Contact

Type in search bar: John
Select "Name" from dropdown
Click "Search"
Should display John Doe contact

Test 4: API Test (Using cURL or Postman)
Register via API:
bashcurl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "test123",
    "firstName": "API",
    "lastName": "Test"
  }'
Expected Response:
json{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}

Part 5: Production Build
Backend Production Build
bashcd backend-sol
npm run build
npm start
Frontend Production Build
bashcd frontend-sol
npm run build
npm run preview
The dist/ folder will contain the production-ready files.

Troubleshooting
Issue 1: Backend - "Cannot connect to MongoDB"
Error:
MongooseServerSelectionError: connect ECONNREFUSED
Solution:

Check your DATABASE_URL in .env file
Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
Ensure your internet connection is active
Check username and password are correct

Issue 2: Frontend - "Network Error"
Error in browser console:
Failed to fetch
Solution:

Ensure backend is running (npm run dev in backend-sol)
Check backend URL in frontend-sol/.env
Verify no firewall blocking port 8000

Issue 3: Port Already in Use
Error:
Error: listen EADDRINUSE: address already in use :::8000
Solution:
bash# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 <PID>

# Or change port in backend-sol/.env
PORT=8001
Issue 4: Module Not Found
Error:
Cannot find module 'express'
Solution:
bash# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
Issue 5: MongoDB Atlas - Authentication Failed
Error:
MongoServerError: Authentication failed
Solution:

Verify username is contactapp
Check password matches what was generated
Ensure no special characters are URL-encoded in connection string
Try regenerating user password in Atlas


Complete Restart Guide
If you encounter issues, follow this complete restart:
1. Stop All Running Processes
bash# Press Ctrl+C in both terminal windows
2. Backend Fresh Start
bashcd backend-sol
rm -rf node_modules package-lock.json
npm install
npm run dev
3. Frontend Fresh Start
bashcd frontend-sol
rm -rf node_modules package-lock.json
npm install
npm run dev

Available Scripts
Backend Scripts
bashnpm run dev          # Start development server with auto-reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint for code quality
Frontend Scripts
bashnpm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

Project Structure
contact-management-system/
├── backend-sol/
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/
│   │   │   ├── modules/
│   │   │   │   ├── Auth/
│   │   │   │   ├── User/
│   │   │   │   ├── Profile/
│   │   │   │   ├── Contact/
│   │   │   │   └── UserContact/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend-sol/
    ├── src/
    │   ├── components/
    │   ├── features/
    │   ├── layouts/
    │   ├── store/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env
    ├── package.json
    └── vite.config.ts

Environment Variables Reference
Backend (.env)
VariableDescriptionExampleNODE_ENVEnvironment modedevelopment / productionPORTServer port8000DATABASE_URLMongoDB Atlas connection stringmongodb+srv://...BCRYPT_SALT_ROUNDSPassword hashing rounds12JWT_ACCESS_SECRETAccess token secret keyrandom string (64 chars)JWT_ACCESS_EXPIRES_INAccess token expiry7dJWT_REFRESH_SECRETRefresh token secret keyrandom string (64 chars)JWT_REFRESH_EXPIRES_INRefresh token expiry30d
Frontend (.env)
VariableDescriptionExampleVITE_API_URLBackend API base URLhttp://localhost:8000/api/v1

Common Commands Summary
bash# Clone repository
git clone <repository-url>
cd contact-management-system

# Backend setup
cd backend-sol
npm install
npm run dev

# Frontend setup (in new terminal)
cd frontend-sol
npm install
npm run dev

# Access application
# Backend: http://localhost:8000
# Frontend: http://localhost:5173

Support & Contact
For issues or questions regarding setup:

Check this INSTALLATION.md file
Review API_DOCUMENTATION.md
Check SOLUTION_BREAKDOWN.md for architecture details
Contact: trptuser001@gmail.com


Notes

Backend must be running before starting frontend
Both .env files are included in the repository (as per requirements)
node_modules folders are NOT committed to Git
Use Node.js 16+ for compatibility
MongoDB Atlas is required (no local MongoDB)