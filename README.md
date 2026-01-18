# QistonPe – Vendor Payment Tracking Backend

A backend API system for MSMEs to manage **vendors, purchase orders, payments, and outstanding balances**.  
Built with **NestJS, TypeScript, and PostgreSQL**, following clean architecture and real-world business logic.

---

## 🚀 Tech Stack

- **Backend:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** class-validator
- **API Testing:** Postman

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone <your-github-repo-url>
cd qistonpe-backend

---

### 2️⃣ Install Dependencies
```bash
npm install

---

### 3️⃣ Environment Variables
```bash
Create a .env file in the root directory:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=qistonpe_db
(Use .env.example as reference)

---

### 4️⃣ Database Setup
```bash
Open pgAdmin
Create a database named:qistonpe_db

---

### 5️⃣ Run the Server
```bash
npm run start:dev

---

✨ Features
```bash
Vendor Management
Create and list vendors
Unique vendor name and email
Active / Inactive status

---

Purchase Orders
```bash
Create purchase orders with multiple items
Auto-generated PO number
Auto-calculated total amount
Auto-calculated due date based on payment terms
Prevent PO creation for inactive vendors

---

Payments
```bash
Record payments against purchase orders
Prevent overpayment

---

Auto-update PO status:
```bash
Approved
Partially Paid
Fully Paid

---

Analytics
```bash
Vendor outstanding balance report
Shows pending amount vendor-wise

---

🔗 API Endpoints
```bash
Vendors
POST /vendors
GET /vendors
Purchase Orders
POST /purchase-orders
GET /purchase-orders

---

Payments
```bash
POST /payments
GET /payments

---

Analytics
```bash
GET /analytics/vendor-outstanding

---

🧪 Testing
```bash
All APIs were tested using Postman, including:
Partial and full payment flows
PO status auto-updates
Overpayment prevention
Analytics calculations

---

🧠 Key Highlights
```bash
Clean NestJS module structure
Business logic handled in services
DTO-based validation
Real-world payment workflow
Accurate outstanding calculations

