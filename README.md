# KGL Business Management System

A full-stack web application for **Karibu Groceries Ltd (KGL)** to manage sales, credit, procurement, stock, and staff across the Maganjo and Matugga branches.

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** HTML5, CSS3, JavaScript, Vue 3, Bootstrap 5, Font Awesome
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
| Reset Any Password | ✅ | ❌ | ❌ |

---

## Setup Instructions

### 1. Clone the repository
`Bash
git clone https://github.com/yourusername/KGL-Business-Management-System
cd karibu-software
`

### 2. Install dependencies
`Bash
npm install
`

### 3. Configure environment variables
`Bash
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
`Bash
node seed.js
`
This creates 7 default users and 10 stock entries.

### 5. Start the server
`Bash
# Development (with auto-restart)
npm run dev

# Production
node server.js
`

The app runs at **http://localhost:3000**

---

##  Default Login Credentials

Default credentials are set during database seeding via `seed.js`.
Contact the system administrator for login access.

> ⚠️ All default passwords must be changed immediately after first login.

---

## Project Structure

`
KARIBU-SOFTWARE/
├── .husky/
│   └── pre-commit
├── middleware/
│   └── auth.js
├── models/
│   ├── CreditSales.js
│   ├── Notification.js
│   ├── Procurement.js
│   ├── Produce.js
│   ├── Sales.js
│   ├── Stock.js
│   └── User.js
├── node_modules/
├── public/
│   ├── credit.html
│   ├── dashboard.html
│   ├── forgot-password.html
│   ├── login.html
│   ├── procurement.html
│   ├── reports.html
│   ├── reset-password.html
│   ├── sales.html
│   ├── stock.html
│   └── users.html
├── routes/
│   ├── authRoutes.js
│   ├── creditRoutes.js
│   ├── procurementRoutes.js
│   ├── reportRoutes.js
│   ├── salesRoutes.js
│   └── stockRoutes.js
├── utils/
│   └── mailer.js
├── .env               
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── package-lock.json
├── package.json
├── README.md
├── seed.js
└── server.js
`

---

## Gmail App Password Setup

1. Go to your Google Account → Security
2. Enable **2-Step Verification** if not already on
3. Go to **App Passwords** → Select app: Mail → Select device: Other
4. Enter "KGL System" → Click Generate
5. Copy the 16-character password into .env as GMAIL_PASS

---

## Development Scripts

`Bash
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
