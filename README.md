# NextChat - Real-Time Chat Application

A modern, real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO.

![NextChat](https://img.shields.io/badge/NextChat-v1.0.0-blue)
![Node](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green)

---

## ✨ Features

### 🔐 Authentication
- User signup and login with JWT
- Secure password hashing with bcrypt
- Password reset via email
- Session management with HTTP-only cookies

### 💬 Real-Time Chat
- Create and join chat rooms with Room IDs
- Real-time messaging with Socket.IO
- Typing indicators
- User join/leave notifications
- Message persistence in localStorage
- Emoji support

### 👤 User Profile
- View and edit profile information
- Change password with verification
- Delete account with password confirmation
- Email cannot be changed (security)

### 🎨 Modern UI/UX
- Responsive design (mobile & desktop)
- Clean black/white/gray theme
- Gradient accents
- Smooth animations
- Optimized font sizes for mobile

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

---

## 📁 Project Structure

```
nextchat/
├── client/                 # Frontend (React + Vite)
│   ├── pages/             # Page components
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Backend (Node.js + Express)
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── .env              # Environment variables
│   └── package.json
│
├── render.yaml           # Render deployment config
├── DEPLOYMENT.md         # Deployment guide
└── RENDER_DEPLOY.md      # Quick Render guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed or MongoDB Atlas account
- Gmail account for email service

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/nextchat.git
cd nextchat
```

### 2. Setup Backend
```bash
cd server
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values
```

**Backend .env:**
```env
PORT=8085
MONGODB_URI=mongodb://localhost:27017/nextchat-db
JWT_SECRET=your-secret-key-min-32-chars
JWT_RAW_SECRET=your-reset-secret-key-min-32-chars
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd ../client
npm install

# Copy and configure environment variables
cp .env.example .env
```

**Frontend .env:**
```env
VITE_API_URL=http://localhost:8085/api
VITE_SOCKET_URL=http://localhost:8085
```

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Open:** http://localhost:5173

---

## 🌐 Production Deployment

### Quick Deploy (5 minutes)

1. **Deploy Backend to Render:**
   - Follow [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)
   - Set environment variables
   - Get backend URL

2. **Deploy Frontend to Vercel:**
   - Connect GitHub repo
   - Set `VITE_API_URL` and `VITE_SOCKET_URL`
   - Deploy

3. **Update Backend:**
   - Set `FRONTEND_URL` to Vercel URL
   - Redeploy

**Detailed Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/users` - Signup
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/users/login` - Login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/users/logout` - Logout
No body required

#### POST `/api/users/forgot-password` - Forgot Password
```json
{
  "email": "john@example.com"
}
```

#### POST `/api/users/reset-password/:token` - Reset Password
```json
{
  "newPassword": "newpassword123"
}
```

### User Endpoints

#### GET `/api/users/me` - Get Current User
Requires authentication

#### PUT `/api/users/:id` - Update User
```json
{
  "username": "newname",
  "password": "newpassword"
}
```

#### DELETE `/api/users/:id` - Delete User
Requires authentication

---

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ CORS protection with dynamic origins
- ✅ Input validation and sanitization
- ✅ Secure password reset with expiring tokens
- ✅ Email verification for password changes
- ✅ Account deletion requires password confirmation

---

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd server
npm test

# Frontend tests (when implemented)
cd client
npm test
```

---

## 📝 Environment Variables

### Backend Required:
- `PORT` - Server port (default: 8085)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (32+ chars)
- `JWT_RAW_SECRET` - Reset token secret (32+ chars)
- `EMAIL_USER` - Gmail address
- `EMAIL_PASS` - Gmail app password
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend Required:
- `VITE_API_URL` - Backend API URL
- `VITE_SOCKET_URL` - Socket.IO server URL

---

## 🐛 Known Issues

- Render free tier: Cold start delay (30-60s) after inactivity
- Email delivery may be delayed on free Gmail tier
- Socket.IO reconnection on network changes

---

## 🔄 Roadmap

- [ ] Add user avatars
- [ ] File/image sharing in chat
- [ ] Voice/video calls
- [ ] Group chat management
- [ ] Message search
- [ ] Dark mode toggle
- [ ] Push notifications
- [ ] Admin dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Developer

**Developed with ❤️ by ANKIT**

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@nextchat.com (if available)

---

## 🙏 Acknowledgments

- React team for the amazing library
- Socket.IO for real-time capabilities
- MongoDB for the database
- Render & Vercel for free hosting

---

**© 2026 NextChat. All rights reserved.**
