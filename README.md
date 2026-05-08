# Royal Timber Maker - Complete System Guide

Welcome to the Royal Timber Maker ERP and CMS system documentation. This README serves as the single source of truth for the entire application, detailing the setup, architecture, implementation, and management of both the frontend storefront and the backend administration panel.

---

## 1. System Architecture & Design

The platform is split into two independent services functioning together seamlessly.

### The Frontend (React + Vite + Tailwind CSS)
The storefront is a modern, responsive Single Page Application built for speed and aesthetics.
- **Styling**: Uses Tailwind CSS with a highly customized premium color palette (`rtm-coral`, `rtm-mustard`, `rtm-teal`).
- **Theming**: Deeply integrated Dark Mode experience (`bg-gray-900`) alongside a warm Light Mode aesthetic (`bg-rtm-light-bg` - Cream, `bg-rtm-light-surface` - Warm Oatmeal) designed to evoke a high-end furniture brand feel.
- **Core Components**:
  - `HeroCarousel.jsx`: An elegant auto-fading hero image component.
  - `ShopGrid.jsx`: A minimalist product grid connected to the backend APIs for dynamic inventory rendering.
  - `QuotePage.jsx`: The final checkout and quote submission form.

### The Backend (Django + DRF)
The backend acts as an Enterprise Resource Planning (ERP) system to manage content, inventory, users, and quotes.
- **Admin Interface**: Overhauled using `django-jazzmin` with custom styling (dark theme + mustard accents) to match the brand.
- **APIs**: Exposes robust REST endpoints for the frontend to fetch products and POST quote submissions (including image uploads).
- **Database Architecture**: 
  - `Category` and `Product` models with `ImageField` for WebP assets.
  - `QuoteRequest` and `QuoteItem` to track orders, with dynamic attributes like `room_area`, `discount`, `amount_paid`, and computed `balance`.
  - `QuoteInspirationImage` models allowing users to attach visual references.

---

## 2. Directory Map: Where to Find What

If you need to make changes to specific parts of the application, refer to this directory map:

### Frontend (React/Vite)
- **Change Browser Tab Name/Icon:** Edit `frontend/index.html` (Look for the `<title>` tag).
- **Modify Colors & Themes:** Edit `frontend/tailwind.config.js`.
- **Header, Footer, and Main Layout:** Edit `frontend/src/App.jsx`.
- **Product Display Grid:** Edit `frontend/src/components/ShopGrid.jsx`.
- **Hero Image Carousel:** Edit `frontend/src/components/HeroCarousel.jsx`.

### Backend (Django)
- **Database Models (Products, Quotes, Tracking):** Edit `inventory/models.py`.
- **Jazzmin Admin Interface (Colors, Layouts):** Edit `backend/settings.py` (Look for `JAZZMIN_UI_TWEAKS` and `JAZZMIN_SETTINGS`).
- **PDF Invoice Template:** Edit `inventory/templates/inventory/invoice_pdf.html`.
- **API Views (Handling form submissions):** Edit `inventory/views.py`.
- **User Tracking Logic:** Edit `inventory/middleware.py`.

---

## 3. Core Features & Implementation

### A. Quote Requests & Inspiration Images
When a customer submits a quote from the frontend, they provide their contact information, additional notes, and specific products (along with the required "Room/Area"). 
- **Image Attachments**: Customers can upload inspiration images (e.g., from Pinterest) attached via a `multipart/form-data` request.
- **Admin View**: Go to the **Quote Requests** section in the Admin Panel to see customer details, items requested, and a gallery of their inspiration images.

### B. Automated PDF Invoicing
You can generate professional provisional invoices for customer quotes in just one click using the `xhtml2pdf` library integration:
1. Go to **Quote Requests** in the Admin Panel.
2. Check the box next to any Quote Request.
3. Select **Generate PDF Invoices** from the "Action" dropdown and click "Go".
4. A professional PDF outlining items, totals, discounts, amounts paid, and the remaining balance will automatically download.

### C. Role-Based Access Control (RBAC)
The system is configured to allow granular permissions for your staff.
1. Navigate to **Authentication and Authorization** -> **Users** and click **Add User**.
2. Under Permissions, check **Staff status** to allow admin panel login.
3. **Content Manager Role**: Move `Content Manager` from "Available groups" to "Chosen groups". This role automatically allows users to manage Products and Categories, but limits them to *View Only* for Quote Requests.
4. **Custom Access**: Alternatively, manually assign specific permissions (e.g., `inventory | product | Can change product`).

### D. Stealth User Tracking & Notifications
Monitor staff and user activity silently and effectively.
- **Login Notifications**: A background signal (`user_logged_in`) triggers the creation of an `AdminNotification` detailing who logged in and from what IP address. View these under **Admin Notifications**.
- **Activity Tracking**: A custom `UserActivityMiddleware` secretly updates a database table on every page request. Check a user's profile in the Admin panel to view the **Activity Tracking** section, showing their exact `last_interaction_time` and `last_interaction_path`.

---

## 4. How to Start the Servers Locally

The application uses two independent development servers. Run them concurrently.

**1. Start the Backend (Django):**
Open your terminal in the root directory (`Royal Timber Maker/`) and run:
```bash
.\venv\Scripts\activate
python manage.py runserver
```
*Access the admin panel at `http://127.0.0.1:8000/admin/`*

**2. Start the Frontend (Vite/React):**
Open a second terminal, navigate to the frontend folder, and start the development server:
```bash
cd frontend
npm run dev
```
*Access the storefront at `http://localhost:5173/`*
