# Authentication API Documentation

## Base URL
`/api/auth`

## Endpoints

### 1. Register User

**URL:** `/register`
**Method:** `POST`
**Description:** Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Email already exists"
}
```
OR
```json
{
  "message": "Please provide all required fields: name, email, password"
}
```

---

### 2. Login User

**URL:** `/login`
**Method:** `POST`
**Description:** Authenticate user and get token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Get User Profile (Protected)

**URL:** `/profile`
**Method:** `GET`
**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "message": "Welcome",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "role": "user",
    "iat": 1624305600,
    "exp": 1624910400
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "No token"
}
```
OR
```json
{
  "message": "Invalid token"
}
```
