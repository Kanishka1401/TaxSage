# TaxSage: AI-Powered Tax Filing Platform

TaxSage is a full-stack MERN application designed to simplify the tax filing process. It connects users with Chartered Accountants (CAs) by using AI to pre-fill tax forms from uploaded documents (like Form-16), which CAs can then review, comment on, and approve.

## Key Features

### For Users
* **AI Form-16 Upload:** Automatically extracts and populates tax filing forms by reading data from Form-16 PDFs.
* **Step-by-Step Filing:** A guided, multi-step process for personal info, income, deductions, and final review.
* **User Dashboard:** A central hub to track filing status, manage documents, and see key stats.
* **Document Management:** Securely upload, categorize, and manage all tax-related documents.
* **Find a CA:** Search and filter a directory of registered CAs and send them service requests.
* **Tax Calculator:** A simple tool to estimate tax liability under old vs. new regimes.
* **AI Help Guide:** An integrated AI chatbot (powered by Gemini) to answer tax-related questions.

### For Chartered Accountants (CAs)
* **CA Dashboard:** A specialized dashboard to view assigned clients, pending reviews, and revenue stats.
* **Client Management:** A complete list of all assigned clients and their filing statuses.
* **Filing Review System:** A dedicated interface to review a client's auto-filled data, add comments, and approve or request changes.
* **Request Management:** Accept or reject new service requests from users.
* **Profile Management:** CAs can manage their public-facing profiles, including specializations, fees, and experience.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router, Context API, Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js |
| **AI** | Google Gemini (for Help Guide) |

---

## Project Structure
<pre>/taxsage-project
├── /client
│   ├── /src
│   │   ├── /assets
│   │   ├── /components
│   │   ├── /context
│   │   ├── /pages
│   │   │   ├── /user
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   ├── TaxFilingPage.jsx
│   │   │   │   ├── Documents.jsx
│   │   │   │   ├── FindCA.jsx
│   │   │   │   └── ...
│   │   │   ├── /ca
│   │   │   │   ├── CADashboard.jsx
│   │   │   │   ├── CAReview.jsx
│   │   │   │   ├── CAClients.jsx
│   │   │   │   └── ...
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── /server
    ├── /controllers
    │   ├── auth.controller.js
    │   ├── ca.auth.controller.js
    │   ├── ca.controller.js
    │   ├── tax.controller.js
    │   ├── document.controller.js  <-- To be added
    │   └── caRequest.controller.js <-- To be added
    ├── /middleware
    │   └── auth.js
    ├── /models
    │   ├── user.model.js
    │   ├── ca.model.js
    │   ├── taxFiling.model.js
    │   ├── document.model.js     <-- To be added
    │   └── caRequest.model.js    <-- To be added
    ├── /routes
    │   ├── auth.routes.js
    │   ├── ca.auth.routes.js
    │   ├── ca.routes.js
    │   ├── tax.routes.js
    │   ├── document.routes.js    <-- To be added
    │   └── caRequest.routes.js   <-- To be added
    ├── /utils
    │   └── taxCalculator.js
    ├── .env
    ├── package.json
    └── server.js
    </pre>
---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* **Node.js** (v18.x or later)
* **npm**
* **MongoDB Atlas** (a free cloud-hosted MongoDB database)

### 1. Backend Setup

```bash
# 1. Clone the repository
git clone https://your-repository-url.com/taxsage.git
cd taxsage/server

# 2. Install backend dependencies
npm install

# 3. Create your .env file
# Create a file named .env in the /server directory
# Then, copy and paste the content from .env.example (see below)
# and fill in your own values.

# 4. Start the backend server
npm run dev
```
The server will be running on http://localhost:5001.

### 2. Frontend Setup
```bash
# 1. Open a new terminal and navigate to the client folder
cd taxsage/client

# 2. Install frontend dependencies
npm install

# 3. Start the React development server
npm start
```
The frontend will be running on http://localhost:3000.

### 3. Environment Variables (.env)
You must create a .env file in the /server directory for the backend to function. Copy the contents below and replace the placeholder values.

```bash
# MongoDB Connection String
MONGO_URI='mongodb+srv://<user>:<password>@<cluster-url>/taxSageDB?retryWrites=true&w=majority'

# JSON Web Token Secret
JWT_SECRET=your-very-strong-jwt-secret-key

# Port
PORT=5001

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# --- Optional (for future features) ---
GOOGLE_VISION_API_KEY=your_google_vision_api_key_here

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. API Endpoints

### Authentication
* `POST /api/auth/register`: Register a new user.
* `POST /api/auth/login`: Log in as a user.
* `POST /api/ca/auth/register`: Register a new CA.
* `POST /api/ca/auth/login`: Log in as a CA.

### Tax Filings (User)
* `POST /api/tax/start-filing`: Create a new tax filing for the year.
* `GET /api/tax/my-filings`: Get all filings for the logged-in user.
* `GET /api/tax/filing`: Get the user's primary (most recent) filing.
* `PUT /api/tax/update-filing/:id`: Update a specific tax filing.
* `POST /api/tax/:id/invite-ca`: Send a review request to a CA.

### Document Management (User)
* `GET /api/documents`: Get all of the user's uploaded documents.
* `POST /api/documents`: Upload a new document (metadata).
* `DELETE /api/documents/:id`: Delete a specific document.

### CA & Requests (User)
* `GET /api/ca/search`: Search for CAs based on filters.
* `POST /api/ca-requests`: Send a new service request to a CA.

### CA (Chartered Accountant)
* `PUT /api/ca/profile`: Update the logged-in CA's profile.
* `GET /api/ca/dashboard`: Get dashboard stats for the logged-in CA.
* `GET /api/tax/review/:id`: Get a specific filing for review (CA only).
* `POST /api/tax/review/:id`: Submit a review (comments, approve, reject) for a filing.
* `GET /api/ca-requests`: Get all requests sent to the logged-in CA.
* `PUT /api/ca-requests/:id`: Update a request (accept, reject, complete).
