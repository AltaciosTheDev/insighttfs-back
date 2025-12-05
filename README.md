# Full Stack CRUD App with 3rd-Party Auth – Backend

A modern **Node.js + Express + TypeScript** backend powering a full-stack CRUD application with secure **third-party authentication (Kinde)**, database persistence using **Neon Serverless PostgreSQL**, and **Prisma ORM** for type-safe queries.  
Includes **Vitest** tests covering authentication middleware and server startup logic.

---

## Tech Stack

### **Backend**
- Node.js
- Express
- TypeScript
- Prisma ORM
- Neon (cloud PostgreSQL)

### **Auth**
- Kinde (JWT-based 3rd-party authentication)

### **Testing**
- Vitest
  - Tests include:
    - Auth middleware validation
    - Server start script

---

## Getting Started

1. Install dependencies:
```bash
npm install
```
2. Start the development server:
```bash
npm run start
```
3. Runs on:
```bash
http://localhost:3000
```

### Running Tests
1. Ensure backend is running:
```bash
npm run start
```
2. Set up required test .env vars:
```bash
KINDE_JWT=your_valid_kinde_jwt
DATABASE_URL=your_neon_database_url
```
3. Run the tests:
```bash
npm run test
```

### Functionality & API Behavior
To understand the full system behavior (CRUD operations, authentication flow, task logic, UI flows), please refer to the [Front End README](https://github.com/AltaciosTheDev/insighttfs-front/edit/main/README.md), which documents:

- All CRUD functionalities
- Authentication behavior
- Task management
- UI/UX flow
- End-to-end behavior
  
