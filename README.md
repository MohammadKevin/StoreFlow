<div align="center">

# StoreFlow API

<p>Enterprise Point of Sale (POS) & Multi-Store Management Backend API</p>

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![NestJS](https://img.shields.io/badge/NestJS-blue?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square) ![Prisma ORM](https://img.shields.io/badge/Prisma%20ORM-blue?style=flat-square) ![MySQL](https://img.shields.io/badge/MySQL-blue?style=flat-square) ![JWT](https://img.shields.io/badge/JWT-blue?style=flat-square) ![REST API](https://img.shields.io/badge/REST%20API-blue?style=flat-square)

</div>

---

## Overview
StoreFlow is an enterprise-grade backend service powering retail POS systems, multi-outlet inventories, cash flow tracking, and supplier operations.

---

## Key Features
- Modular NestJS architecture with strict dependency injection
- Role-Based Access Control (Superadmin, Store Manager, Cashier)
- Automated inventory deduction and low-stock threshold alerting
- Shift management and cash-in/cash-out drawer logs
- Exportable financial audits and sales analytics

---

## Tech Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma ORM
- **Database**: MySQL / PostgreSQL
- **Security**: JWT, Bcrypt, Passport Strategy

---

## Project Structure
```text
StoreFlow/
├── src/
│   ├── auth/           # JWT authentication & guard policies
│   ├── users/          # User & role management
│   ├── products/       # Products, categories, and barcode lookup
│   ├── inventory/      # Stock tracking and adjustments
│   ├── transactions/   # POS checkout & billing
│   └── reports/        # Sales summary and exports
├── prisma/             # Schema definitions and migrations
└── test/               # E2E test suites
```

---

## Getting Started

### Prerequisites
Make sure you have the required runtimes and tools installed on your machine:
- Node.js (v18+ recommended) / Appropriate runtime
- Git

### Installation & Local Setup
```bash
git clone https://github.com/MohammadKevin/StoreFlow.git
cd StoreFlow
npm install
cp .env.example .env # Configure DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run start:dev
```

---

## Author
**Mohammad Kevin Arif Rudianto**
- **GitHub:** [@MohammadKevin](https://github.com/MohammadKevin)
- **Portfolio:** [portfolio-mohammadkevin.vercel.app](https://portfolio-mohammadkevin.vercel.app)
- **LinkedIn:** [Mohammad Kevin](https://www.linkedin.com/in/mohammad-kevin-arif-rudianto-945733347)
- **Email:** [kvn4.200581@gmail.com](mailto:kvn4.200581@gmail.com)

---

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

<div align="center">
If you found this repository useful, please consider giving it a star!
</div>
