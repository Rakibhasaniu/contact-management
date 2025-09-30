markdown# Contact Management System - API Documentation

## Base URL
http://localhost:8000/api/v1

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
Authorization: Bearer <access_token>

---

## Authentication Endpoints

### 1. Register User
Create a new user account with profile and optional initial contacts.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "otherEmails": ["john.doe@company.com"],
  "contacts": [
    {
      "phoneNumber": "01534629987",
      "alias": "Simon"
    }
  ]
}
Response: 201 Created
json{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}

2. Login User
Authenticate user and receive access token.
Endpoint: POST /auth/login
Request Body:
json{
  "email": "user@example.com",
  "password": "password123"
}
Response: 200 OK
json{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}

3. Change Password
Change authenticated user's password.
Endpoint: POST /auth/change-password
Authentication: Required
Request Body:
json{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
Response: 200 OK
json{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "message": "Password changed successfully"
  }
}

Profile Endpoints
1. Get My Profile
Retrieve authenticated user's profile.
Endpoint: GET /profile/me
Authentication: Required
Response: 200 OK
json{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "otherEmails": ["john.doe@company.com"],
    "contacts": [],
    "createdAt": "2025-09-29T10:30:00.000Z",
    "updatedAt": "2025-09-29T10:30:00.000Z"
  }
}

2. Update My Profile
Update authenticated user's profile information.
Endpoint: PATCH /profile/me
Authentication: Required
Request Body:
json{
  "firstName": "John Updated",
  "lastName": "Doe",
  "otherEmails": ["new.email@example.com"]
}
Response: 200 OK

Contact Management Endpoints
1. Add Contact
Add a new contact to user's personal address book.
Endpoint: POST /contacts
Authentication: Required
Request Body:
json{
  "phoneNumber": "01534629987",
  "alias": "Simon",
  "labels": ["friend", "work"],
  "notes": "Met at conference"
}
Response: 201 Created

2. Get All My Contacts
Retrieve all contacts for authenticated user with pagination.
Endpoint: GET /contacts
Authentication: Required
Query Parameters:

page (optional): Page number (default: 1)
limit (optional): Items per page (default: 20)
search (optional): Search term
searchBy (optional): Search field - alias, phone, or both (default: both)

Example: GET /contacts?page=1&limit=10&search=Simon&searchBy=alias
Response: 200 OK

3. Search Contacts
Search contacts by alias or phone number.
Endpoint: GET /contacts/search
Authentication: Required
Query Parameters:

search (required): Search term
searchBy (optional): alias, phone, or both
page (optional): Page number
limit (optional): Items per page


4. Update Contact
Update contact alias, labels, or notes.
Endpoint: PATCH /contacts/:id
Authentication: Required
Request Body:
json{
  "alias": "Simon Updated",
  "labels": ["friend", "family"],
  "notes": "My best friend"
}

5. Delete Contact
Remove a contact from user's address book.
Endpoint: DELETE /contacts/:id
Authentication: Required
Response: 200 OK

Error Responses
400 Bad Request - Validation Error
json{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
401 Unauthorized
json{
  "success": false,
  "message": "You are not authorized!"
}
404 Not Found
json{
  "success": false,
  "message": "Contact not found"
}
409 Conflict
json{
  "success": false,
  "message": "User with this email already exists"
}

Phone Number Normalization
Phone numbers are automatically normalized:

Remove non-digit characters
Remove leading zeros
Add country code (+880 for Bangladesh)

Examples:

01534629987 → +8801534629987
0 1534 629 987 → +8801534629987

