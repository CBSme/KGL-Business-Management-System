# KGL Business Management System

A full-stack web application for **Karibu Groceries Ltd (KGL)** to manage sales, credit, procurement, stock, and staff across the Maganjo and Matugga branches.

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** Vue 3, Bootstrap 5, Font Awesome
- **Auth:** JWT (8h expiry), bcryptjs
- **Email:** Nodemailer + Gmail App Password
- **Tools:** ESLint, Prettier, Husky, lint-staged

---

## User Roles & Permissions

| Feature | Director | Manager | Sales Agent |
|---|---|---|---|
| View Dashboard | ✅ All stats | ✅ All stats | ✅ Limited stats |
| Record Sale | ❌ | ✅ | ✅ |
| Record Credit Sale | ❌ | ✅ | ✅ |
| Mark Credit as Paid | ❌ | ✅ | ❌ |
| Record Procurement | ❌ | ✅ | ❌ |
| View Stock | ✅ All branches | ✅ Own branch | ✅ Own branch |
| View Reports | ✅ | ✅ | ❌ |
| Branch Comparison | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Reset Any Password | ✅ | ✅ | ❌ |

---

## Setup Instructions

### 1. Clone the repository
`ash
git clone https://github.com/yourusername/karibu-software.git
cd karibu-software
`

### 2. Install dependencies
`ash
npm install
`

### 3. Configure environment variables
`ash
# Copy the example file
cp .env.example .env
`
Then open .env and fill in your real values:
- MONGO_URI — your MongoDB Atlas connection string
- JWT_SECRET — a long random secret (e.g. 64 random characters)
- GMAIL_USER — Gmail address used to send reset emails
- GMAIL_PASS — 16-character Gmail App Password (not your Gmail password)
- APP_URL — your app's base URL

### 4. Seed the database (first time only)
`ash
node seed.js
`
This creates 7 default users and 10 stock entries.

### 5. Start the server
`ash
# Development (with auto-restart)
npm run dev

# Production
node server.js
`

The app runs at **http://localhost:3000**

---

## Default Login Credentials

> ⚠️ Change all passwords immediately after first login in production.

| Role | Username | Password | Branch |
|---|---|---|---|
| Director | director | director123 | All |
| Manager | manager1 | manager123 | Maganjo |
| Manager | manager2 | manager123 | Matugga |
| Sales Agent | gent1 | gent123 | Maganjo |
| Sales Agent | gent2 | gent123 | Maganjo |
| Sales Agent | gent3 | gent123 | Matugga |
| Sales Agent | gent4 | gent123 | Matugga |

---

## Project Structure

`
karibu-software/
├── models/
│   ├── User.js
│   ├── Sales.js
│   ├── CreditSales.js
│   ├── Procurement.js
│   ├── Stock.js
│   ├── Notification.js
│   └── Produce.js
├── routes/
│   ├── authRoutes.js
│   ├── salesRoutes.js
│   ├── creditRoutes.js
│   ├── procurementRoutes.js
│   ├── stockRoutes.js
│   └── reportRoutes.js
├── middleware/
│   └── auth.js
├── utils/
│   └── mailer.js
├── public/
│   ├── login.html
│   ├── dashboard.html
│   ├── sales.html
│   ├── credit.html
│   ├── procurement.html
│   ├── stock.html
│   ├── reports.html
│   ├── users.html
│   ├── forgot-password.html
│   └── reset-password.html
├── .env               ← never commit
├── .env.example       ← commit this
├── .gitignore
├── eslint.config.js
├── .prettierrc
├── seed.js
└── server.js
`

---

## 📧 Gmail App Password Setup

1. Go to your Google Account → Security
2. Enable **2-Step Verification** if not already on
3. Go to **App Passwords** → Select app: Mail → Select device: Other
4. Enter "KGL System" → Click Generate
5. Copy the 16-character password into .env as GMAIL_PASS

---

## 🛠️ Development Scripts

`ash
npm run dev      # Start with nodemon (auto-restart)
npm run lint     # Check code with ESLint
npm run format   # Format code with Prettier
node seed.js     # Reset and reseed the database
`

---

## Security Notes

- JWT tokens expire after 8 hours
- Passwords are hashed with bcryptjs (salt rounds: 10)
- Password reset links expire after 1 hour
- .env is excluded from git via .gitignore
- Role-based access enforced on both frontend and backend

---

## 📞 Support

For technical issues contact the system developer.
