# Bio CWT - Next.js Frontend

This is the frontend web application for the Bio CWT Wood Species and Services CMS project. It includes the customer-facing landing website (Services Pricing, Custom Wood Products, Gallery, Contact, About Us) and the restricted Administrative Dashboard.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* Backend API server running at `http://localhost:3000`

### Step-by-Step Run Guide
1. Navigate to the frontend directory:
   ```bash
   cd front
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:3001`** (or the port specified in your console).

---

## 🔑 Environment Variables
Create a file named `.env.local` in the root of the `front/` directory and configure the backend URL path:
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

---

## 🔐 How to Log In to the Admin Panel

The dashboard lets you manage all live services pricing matrices, add custom wood species specs, upload new showcase imagery, and update homepage text content.

1. Navigate to the login route in your browser:
   * **URL:** **`http://localhost:3001/login`**
2. Enter the default administrator seed credentials:
   * **Email:** `admin@wood.com`
   * **Password:** `admin123`

---

## 🧱 Frontend Architecture Overview

* **Framework:** Next.js 15 (utilizing App Router)
* **Styling & Layout:** Tailwind CSS & responsive design grids. Staggered visual cards and sliders are built for both mobile views and full desktop screens.
* **State & Data Flow:**
  * Landing page components pull configuration details dynamically from the backend `GET /api/cms` and `GET /api/services` endpoints.
  * The `/dashboard` route group uses React hooks (`useState`, `useEffect`) and an integrated `ApiClient` to perform authenticated CRUD calls with backend storage.

---

## 🤖 AI Tools Used
* **Antigravity IDE Agent** by Google DeepMind (Advanced Agentic Coding): Used for creating Next.js page layouts, designing UI grids, managing page states, setting up frontend pricing calculators, adding client-side form validations, and setting up dashboard views.

---

## ⏱️ Development Time Spent
* **Timeline:** 2 days
* **Total Time Invested:** ~12 hours of active work (engineering layout structures, styling details, and admin dashboard panels).
