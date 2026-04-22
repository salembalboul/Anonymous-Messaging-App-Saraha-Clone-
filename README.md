# Saraha App - Anonymous Messaging Platform

A backend API for anonymous messaging built with Node.js and Express. It allows users to send and receive messages anonymously with secure authentication and modern backend practices.

---

## Features

### User Features
- Sign Up / Sign In
- Profile management (including image upload)
- Send & receive anonymous messages
- Freeze / unfreeze account
- Forgot & reset password

### Technical Features
- JWT-based authentication
- Image upload using Cloudinary
- Email service using Nodemailer
- Data validation with Joi
- Global error handling
- CORS configuration

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Validation:** Joi
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Security:** bcrypt, crypto-js

---

## Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/salembalboul/Anonymous-Messaging-App-Saraha-Clone-.git
cd Anonymous-Messaging-App-Saraha-Clone-
2. Install dependencies
npm install
3. Run the application
# Development
npm run dev

# Production
npm start
```

# Project Structure
```bash
sarahaApp/
├── src/
│   ├── DB/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── users/
│   │   └── messages/
│   ├── service/
│   ├── utils/
│   └── app.controller.js
├── uploads/
├── index.js
├── package.json
└── README.md
```

## API Endpoints
```bash
 Authentication
POST /users/signUp
POST /users/signIn
POST /users/forgetPassword
POST /users/resetPassword

 User Profile
GET /users/profile
PATCH /users/profile
PATCH /users/updatePassword
PATCH /users/freezeAccount
PATCH /users/unFreezeAccount

Messages
POST /messages/sendMessage
GET /messages/getMessages
```
## Security Features
Password hashing using bcrypt
JWT-based authentication
Input validation with Joi
CORS configuration
Secure file upload via Cloudinary
