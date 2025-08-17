# NutriByte API Documentation

## Authentication Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "success": true,
    "data": {
      "userId": "user_id",
      "email": "user@example.com",
      "token": "jwt_token"
    }
  }
  ```
- **Error Response** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": {
      "message": "Email already registered"
    }
  }
  ```

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "userId": "user_id",
      "email": "user@example.com",
      "token": "jwt_token"
    }
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
    "success": false,
    "error": {
      "message": "Invalid credentials"
    }
  }
  ```

### Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Headers**:
  ```
  Authorization: Bearer jwt_token
  ```
- **Success Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Successfully logged out"
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
    "success": false,
    "error": {
      "message": "Authentication token required"
    }
  }
  ```

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer jwt_token
```

The token is obtained from the login or register response and must be included in all subsequent requests to protected endpoints.

## Error Handling
All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "error": {
    "message": "Error message description"
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error 