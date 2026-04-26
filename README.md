# 🛒 ShopZone – Full-Stack E-Commerce App

Spring Boot + Hibernate + Spring Security (JWT) backend with a React + Vite frontend.

---

## 🗂️ Project Structure

```
ecommerce/
├── backend/          ← Spring Boot (Maven)
│   ├── src/main/java/com/ecommerce/
│   │   ├── controller/    AuthController, ProductController, CartController, OrderController, PaymentController
│   │   ├── service/       AuthService, ProductService, CartService, OrderService, PaymentService
│   │   ├── repository/    JPA repositories (UserRepo, ProductRepo, CartRepo, OrderRepo, PaymentRepo)
│   │   ├── model/         User, Product, Category, Cart, Order, OrderItem, Payment
│   │   ├── dto/           LoginRequest, RegisterRequest, ProductDTO, AuthResponse, ApiResponse, CheckoutRequest
│   │   ├── security/      JwtUtil, JwtFilter, SecurityConfig
│   │   └── exception/     GlobalExceptionHandler, ResourceNotFoundException
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql       ← seed data
└── frontend/         ← React + Vite
    └── src/
        ├── api/           axiosConfig, authApi, productApi, orderApi, paymentApi
        ├── components/    Navbar, Footer, ProductCard, CartItem, Loader, ProtectedRoute
        ├── context/       AuthContext, CartContext
        ├── pages/         Home, Products, ProductDetails, Cart, Checkout, Login, Register, Orders, AdminDashboard
        ├── redux/         store, productSlice, cartSlice
        ├── routes/        AppRoutes
        ├── utils/         constants, helpers
        └── styles/        global.css
```

---

## ⚙️ Backend Setup

### 1. MySQL Database

```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080/api**

---

## 🎨 Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start dev server

```bash
npm run dev
```

The app opens at **http://localhost:5173**

> Vite proxies `/api` → `http://localhost:8080` automatically.

---

## 🔑 Default Admin Credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | admin@ecommerce.com    |
| Password | Admin@123              |

---

## 🚀 API Endpoints

| Method | Endpoint                   | Auth     | Description            |
|--------|----------------------------|----------|------------------------|
| POST   | /api/auth/register         | Public   | Register new user      |
| POST   | /api/auth/login            | Public   | Login, returns JWT     |
| GET    | /api/auth/me               | JWT      | Current user info      |
| GET    | /api/products              | Public   | List / search products |
| GET    | /api/products/:id          | Public   | Product detail         |
| POST   | /api/products              | ADMIN    | Create product         |
| PUT    | /api/products/:id          | ADMIN    | Update product         |
| DELETE | /api/products/:id          | ADMIN    | Delete product         |
| GET    | /api/categories            | Public   | All categories         |
| GET    | /api/cart                  | JWT      | Get cart               |
| POST   | /api/cart/add              | JWT      | Add to cart            |
| PUT    | /api/cart/:id              | JWT      | Update quantity        |
| DELETE | /api/cart/:id              | JWT      | Remove item            |
| POST   | /api/orders/checkout       | JWT      | Place order            |
| GET    | /api/orders/my             | JWT      | My orders              |
| GET    | /api/orders                | ADMIN    | All orders             |
| PUT    | /api/orders/:id/status     | ADMIN    | Update order status    |
| PUT    | /api/orders/:id/cancel     | JWT      | Cancel order           |
| POST   | /api/payments/process/:id  | JWT      | Process payment        |

---

## 🛠️ Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Backend    | Spring Boot 3, Spring MVC, Spring Security   |
| ORM        | Hibernate / Spring Data JPA                  |
| Database   | MySQL 8                                      |
| Auth       | JWT (JJWT 0.11)                              |
| Frontend   | React 18, Vite, React Router v6              |
| State      | Context API + Redux Toolkit                  |
| HTTP       | Axios                                        |
| UI         | Custom CSS (no UI library)                   |
