# User Management Web Application

A Next.js 14 (App Router) project for user registration, authentication, and profile management, using a REST API backend.


## Technologies
- Next.js 14 (App Router)
- Tailwind CSS
- Zustand
- React Hook Form + Zod
- Axios
- React Toastify
- js-cookie

## API
- Base URL: https://rest-api-production-7e07.up.railway.app/
- API Docs: https://rest-api-production-7e07.up.railway.app/docs

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Environment Variables
No .env is required for the public API, but you may add one for custom config if needed.

### 4. Build for production
```bash
npm run build
npm start
```

## Project Structure
- `/src/app` — App Router pages (register, login, profile, etc.)
- `/src/components` — Shared UI components
- `/src/store` — Zustand store for auth
- `/src/services` — Axios instance and API functions


