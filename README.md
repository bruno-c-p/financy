# Financy - Personal Finance Management

Financy is a modern, full-stack personal finance application designed to help users track their income, expenses, and categorize their transactions effectively. It features a robust backend using GraphQL and a responsive, interactive frontend.

## 🚀 Technlogy Stack

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/) & [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **API**: GraphQL (Schema-first approach via [TypeGraphQL](https://typegraphql.com/))
- **Database**: SQLite (via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

### Frontend

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) & [Apollo Client](https://www.apollographql.com/docs/react/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/) (Icons)
- **Routing**: [React Router](https://reactrouter.com/)

## ✨ Features

- **User Authentication**: Secure Login and Registration.
- **Dashboard**: Overview of financial health (Income, Expenses, Balance).
- **Transactions**: Add, edit, delete, and view transactions.
- **Categories**: Manage custom categories with icons and colors.
- **Responsive Design**: Works on desktop and mobile.

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/bruno-c-p/financy.git
cd financy
```

### 2. Backend Setup

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

Set up the database:

```bash
# Generate Prisma Client
npm run generate

# Run Migrations
npm run migrate

# (Optional) Seed the database
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The backend server will likely start on `http://localhost:4000` (check console output).

### 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
financy/
├── backend/            # Express + GraphQL Server
│   ├── prisma/         # Database schema & migrations
│   ├── src/
│   │   ├── graphql/    # Context & Schema definition
│   │   ├── models/     # TypeGraphQL Models
│   │   ├── resolvers/  # GraphQL Resolvers
│   │   ├── services/   # Business Logic
│   │   └── index.ts    # Entry point
│   └── package.json
│
└── frontend/           # React + Vite Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── hooks/      # Custom React hooks
    │   ├── lib/        # Utilities & Apollo Client setup
    │   ├── pages/      # Route pages
    │   ├── stores/     # Zustand stores
    │   ├── types/      # TypeScript interfaces
    │   └── App.tsx     # Main App component
    └── package.json
```

## 📜 Scripts

### Backend

- `npm run dev`: Start the development server with hot-reloading.
- `npm run generate`: Generate Prisma client artifacts.
- `npm run migrate`: Apply database migrations.
- `npm run seed`: Seed the database with initial data.

### Frontend

- `npm run dev`: Start the Vite development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview the production build.

## 📄 License

This project is licensed under the ISC License.
