# Mumtaz Store - Cosmetics & Baby Products eCommerce

A complete full-stack eCommerce web application for a cosmetics and baby products store.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + TypeScript
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT-based admin login
- **Image Upload:** Multer (local storage)

## Project Structure

```
root/
├── src/ (Frontend)
│   ├── components/     → Navbar, Footer, Hero, ProductCard
│   ├── pages/          → Home, Products, ProductDetail, Cart, AdminLogin, AdminDashboard
│   ├── context/        → AuthContext (JWT), CartContext
│   ├── services/       → API layer (Mock + Real backend)
│   ├── types/          → TypeScript interfaces
│   └── utils/          → Tailwind helper (cn)
│
├── server/ (Backend)
│   ├── config/         → MongoDB connection (db.js)
│   ├── models/         → Product.js, Admin.js (Mongoose schemas)
│   ├── controllers/    → productController.js, authController.js
│   ├── routes/         → productRoutes.js, authRoutes.js
│   ├── middleware/     → JWT auth.js, errorHandler.js
│   ├── utils/          → Multer upload.js, seedAdmin.js
│   └── server.js       → Express entry point
│
├── .env.example
└── README.md
```

## Features

### User Side
- Homepage with hero section, category cards, and featured products
- Product listing with category filters and search
- Product detail page with quantity selector and add-to-cart
- Shopping cart with item management, quantity updates, and order summary
- Responsive modern UI for mobile and desktop

### Admin Panel
- Secure JWT-based login
- Dashboard with statistics (Total, Cosmetics, Baby, Low Stock)
- Add, Edit, Delete products with image upload
- Protected routes (redirects non-authenticated users)
- Confirmation dialog before delete

### Backend API
- `POST /api/auth/login` — JWT admin login
- `POST /api/auth/register` — Register admin
- `GET /api/auth/me` — Get current admin
- `GET /api/products` — Fetch all (with search/category filters)
- `GET /api/products/:id` — Fetch single
- `POST /api/products` — Create (protected + image upload)
- `PUT /api/products/:id` — Update (protected + image upload)
- `DELETE /api/products/:id` — Delete (protected)

## Quick Start (Frontend Only - Mock Mode)

The frontend includes a built-in Mock API that stores all data in `localStorage`. This means the app works immediately without a backend.

```bash
# Install dependencies
npm install

# Run the frontend
npm run dev
```

Open `http://localhost:5173` and use the demo admin credentials:
- **Email:** `admin@mumtazstore.com`
- **Password:** `admin123`

## Full Stack Setup (With MongoDB Backend)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB

### 1. Install All Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Variables

**Root `.env` (Frontend):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Server `.env` (Backend):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Create Admin User

```bash
cd server
node utils/seedAdmin.js
```

Or use the register API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mumtazstore.com","password":"admin123","name":"Admin"}'
```

### 4. Switch to Real Backend

In `src/services/api.ts`, change:
```typescript
const USE_MOCK = false;  // was: true
```

### 5. Run Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Database Schemas

### Product Schema
```javascript
{
  name: String,        // required
  description: String, // required
  price: Number,       // required, min: 0
  category: String,    // enum: ['Cosmetics', 'Baby Products']
  imageURL: String,    // required
  stockStatus: Number, // required, min: 0
  createdAt: Date,     // auto
  updatedAt: Date      // auto
}
```

### Admin Schema
```javascript
{
  email: String,       // required, unique
  password: String,    // required, hashed with bcrypt
  name: String,        // default: 'Admin'
  createdAt: Date,     // auto
  updatedAt: Date      // auto
}
```

## Deployment

### Frontend
```bash
npm run build
```
Deploy the `dist/` folder to Vercel, Netlify, or any static host.

### Backend
Deploy the `server/` directory to Render, Railway, or any Node.js host. Set the environment variables in your hosting dashboard.

## License

MIT
