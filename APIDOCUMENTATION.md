🔐 Authentication Endpoints
1. Register User
Endpoint: POST /auth/register
Description: Register a new user with optional initial contacts
Request Body:
json{
  "firstName": "Rakib",
  "lastName": "Ahmed", 
  "email": "rakib@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "contacts": [
    {
      "phoneNumber": "01712345678",
      "alias": "Karim Bhai"
    },
    {
      "phoneNumber": "01534629987",
      "alias": "Office Manager"  
    }
  ]
}
Success Response (201):
json{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "67e8f1234567890abcdef123",
      "email": "rakib@example.com",
      "firstName": "Rakib",
      "lastName": "Ahmed"
    }
  }
}
Error Response (400):
json{
  "success": false,
  "message": "User already exists with this email"
}

2. Login User
Endpoint: POST /auth/login
Request Body:
json{
  "email": "rakib@example.com", 
  "password": "password123"
}
Success Response (200):
json{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "67e8f1234567890abcdef123",
      "email": "rakib@example.com",
      "firstName": "Rakib",
      "lastName": "Ahmed"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

3. Change Password
Endpoint: POST /auth/change-password
Headers: Authorization: Bearer <token>
Request Body:
json{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}
Success Response (200):
json{
  "success": true,
  "message": "Password changed successfully"
}

👤 Profile Endpoints
4. Get My Profile
Endpoint: GET /profile/me
Headers: Authorization: Bearer <token>
Success Response (200):
json{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "67e8f1234567890abcdef124",
    "firstName": "Rakib",
    "lastName": "Ahmed", 
    "otherEmails": ["rakib.work@company.com"],
    "userId": {
      "_id": "67e8f1234567890abcdef123",
      "email": "rakib@example.com"
    },
    "createdAt": "2025-09-30T10:00:00.000Z",
    "updatedAt": "2025-09-30T10:00:00.000Z"
  }
}

5. Update My Profile
Endpoint: PATCH /profile/me
Headers: Authorization: Bearer <token>
Request Body:
json{
  "firstName": "Rakib Updated",
  "lastName": "Ahmed",
  "otherEmails": ["rakib.work@company.com", "rakib.personal@gmail.com"]
}
Success Response (200):
json{
  "success": true,
  "message": "Profile updated successfully", 
  "data": {
    "_id": "67e8f1234567890abcdef124",
    "firstName": "Rakib Updated",
    "lastName": "Ahmed",
    "otherEmails": ["rakib.work@company.com", "rakib.personal@gmail.com"],
    "userId": {
      "_id": "67e8f1234567890abcdef123", 
      "email": "rakib@example.com"
    },
    "updatedAt": "2025-09-30T10:30:00.000Z"
  }
}

📞 Contact Endpoints
6. Get All Contacts
Endpoint: GET /contacts
Headers: Authorization: Bearer <token>
Success Response (200) - Rakib's Contacts:
json{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": {
    "contacts": [
      {
        "_id": "67e8f1234567890abcdef125",
        "alias": "Karim Bhai",
        "labels": [],
        "notes": "",
        "createdAt": "2025-09-30T10:00:00.000Z",
        "updatedAt": "2025-09-30T10:00:00.000Z",
        "contact": {
          "_id": "67e8f1234567890abcdef130",
          "phoneNumber": "01712345678",
          "normalizedPhone": "+8801712345678"
        }
      },
      {
        "_id": "67e8f1234567890abcdef126", 
        "alias": "Manager Sahib",
        "labels": ["work", "important"],
        "notes": "Main office contact",
        "createdAt": "2025-09-30T10:00:00.000Z",
        "updatedAt": "2025-09-30T10:15:00.000Z", 
        "contact": {
          "_id": "67e8f1234567890abcdef131",
          "phoneNumber": "01534629987",
          "normalizedPhone": "+8801534629987"
        }
      },
      {
        "_id": "67e8f1234567890abcdef127",
        "alias": "Rakib's Cousin",
        "labels": ["family", "close"],
        "notes": "My favorite cousin",
        "createdAt": "2025-09-30T10:05:00.000Z",
        "updatedAt": "2025-09-30T10:05:00.000Z",
        "contact": {
          "_id": "67e8f1234567890abcdef132", 
          "phoneNumber": "01999888777",
          "normalizedPhone": "+8801999888777"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}

7. Search Contacts
Endpoint: GET /contacts?searchBy={type}&search={term}
Headers: Authorization: Bearer <token>
Query Parameters:

searchBy: alias or phone
search: Search term

Example 1 - Search by Alias:
GET /contacts?searchBy=alias&search=Karim
Success Response (200):
json{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": {
    "contacts": [
      {
        "_id": "67e8f1234567890abcdef125",
        "alias": "Karim Bhai", 
        "labels": [],
        "notes": "",
        "contact": {
          "_id": "67e8f1234567890abcdef130",
          "phoneNumber": "01712345678",
          "normalizedPhone": "+8801712345678"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
Example 2 - Search by Phone (Critical Test):
Rakib searches: GET /contacts?searchBy=phone&search=01712345678
json{
  "success": true,
  "message": "Contacts retrieved successfully", 
  "data": {
    "contacts": [
      {
        "_id": "67e8f1234567890abcdef125",
        "alias": "Karim Bhai",  // ← Rakib's alias
        "contact": {
          "phoneNumber": "01712345678"
        }
      }
    ]
  }
}
Diba searches same number: GET /contacts?searchBy=phone&search=01712345678
json{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": {
    "contacts": [
      {
        "_id": "67e8f1234567890abcdef140", 
        "alias": "My Brother",  // ← Diba's alias (different!)
        "contact": {
          "phoneNumber": "01712345678" 
        }
      }
    ]
  }
}

8. Add New Contact
Endpoint: POST /contacts
Headers: Authorization: Bearer <token>
Request Body:
json{
  "phoneNumber": "01911223344",
  "alias": "Doctor",
  "labels": ["medical", "important"],
  "notes": "Family doctor - very reliable"
}
Success Response (201):
json{
  "success": true,
  "message": "Contact added successfully",
  "data": {
    "_id": "67e8f1234567890abcdef128",
    "alias": "Doctor", 
    "labels": ["medical", "important"],
    "notes": "Family doctor - very reliable",
    "createdAt": "2025-09-30T11:00:00.000Z",
    "updatedAt": "2025-09-30T11:00:00.000Z",
    "contact": {
      "_id": "67e8f1234567890abcdef133",
      "phoneNumber": "01911223344",
      "normalizedPhone": "+8801911223344"
    }
  }
}

9. Update Contact
Endpoint: PATCH /contacts/{contactId}
Headers: Authorization: Bearer <token>
Request Body:
json{
  "alias": "Dr. Rahman Updated",
  "labels": ["medical", "important", "family"],
  "notes": "Family doctor - emergency contact"
}
Success Response (200):
json{
  "success": true,
  "message": "Contact updated successfully",
  "data": {
    "_id": "67e8f1234567890abcdef128",
    "alias": "Dr. Rahman Updated",
    "labels": ["medical", "important", "family"], 
    "notes": "Family doctor - emergency contact",
    "updatedAt": "2025-09-30T11:30:00.000Z",
    "contact": {
      "_id": "67e8f1234567890abcdef133",
      "phoneNumber": "01911223344",
      "normalizedPhone": "+8801911223344"
    }
  }
}

10. Delete Contact
Endpoint: DELETE /contacts/{contactId}
Headers: Authorization: Bearer <token>
Success Response (200):
json{
  "success": true, 
  "message": "Contact deleted successfully"
}

🔍 Per-User Aliasing Examples
Critical Feature: Same Phone, Different Aliases
Phone Number: 01712345678
UserGET /contacts ResponseAlias ShownRakibsearchBy=phone&search=01712345678"Karim Bhai"DibasearchBy=phone&search=01712345678"My Brother"NijhumsearchBy=phone&search=01712345678"Nijhum's Contact"SohanasearchBy=phone&search=01712345678No results
Phone Number: 01987654321
UserGET /contacts ResponseAlias ShownRakibsearchBy=phone&search=01987654321No resultsDibasearchBy=phone&search=01987654321"Best Friend"NijhumsearchBy=phone&search=01987654321No resultsSohanasearchBy=phone&search=01987654321"My Sister"

❌ Error Responses
Authentication Errors
401 Unauthorized:
json{
  "success": false,
  "message": "Invalid or expired token"
}
403 Forbidden:
json{
  "success": false,
  "message": "Access denied"
}
Validation Errors
400 Bad Request:
json{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phoneNumber",
      "message": "Phone number is required"
    },
    {
      "field": "alias", 
      "message": "Alias is required"
    }
  ]
}
Resource Errors
404 Not Found:
json{
  "success": false,
  "message": "Contact not found"
}
409 Conflict:
json{
  "success": false,
  "message": "User already exists with this email"
}

📊 Sample Data Summary
Database State After 4 Users:
Users (4 total):

rakib@example.com (3-4 contacts)
diba@example.com (2-3 contacts)
nijhum@example.com (4 contacts)
sohana@example.com (3 contacts)

Global Contacts (~8-10 unique phone numbers):

01712345678 (shared by Rakib, Diba, Nijhum)
01987654321 (shared by Diba, Sohana)
01534629987 (Rakib only)
01999888777 (Rakib only)
01666777888 (Nijhum only)
01555444333 (Nijhum only)
01444333222 (Nijhum only)
01333222111 (Sohana only)
01222111000 (Sohana only)

UserContacts (~12-14 total linking records):

Multiple users linked to same global contact with different aliases


🧪 Testing Scenarios
1. Cross-User Search Test
bash# Login as Rakib
curl -H "Authorization: Bearer <rakib_token>" \
     "http://localhost:8000/api/v1/contacts?searchBy=phone&search=01712345678"
# Should return: "Karim Bhai"

# Login as Diba  
curl -H "Authorization: Bearer <diba_token>" \
     "http://localhost:8000/api/v1/contacts?searchBy=phone&search=01712345678"
# Should return: "My Brother"
2. Isolation Test
bash# Rakib searches for Diba's alias
curl -H "Authorization: Bearer <rakib_token>" \
     "http://localhost:8000/api/v1/contacts?searchBy=alias&search=My Brother"
# Should return: No results (isolated per user)
3. Global Deduplication Test
bash# Check global contacts collection
# Should have only ONE record for 01712345678 despite 3 users having it

🔗 Postman Collection
Import this collection for easy testing:
json{
  "info": {
    "name": "Contact Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Rakib",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Rakib\",\n  \"lastName\": \"Ahmed\",\n  \"email\": \"rakib@example.com\",\n  \"password\": \"password123\",\n  \"confirmPassword\": \"password123\",\n  \"contacts\": [\n    {\n      \"phoneNumber\": \"01712345678\",\n      \"alias\": \"Karim Bhai\"\n    }\n  ]\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}