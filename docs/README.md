# Technical Documentation: Financial AI Manager

This document provides a technical overview of the Financial AI Manager application, covering its architecture, setup process, and API structure.

## 1. Architecture Overview

The application is a full-stack monorepo built with Yarn Workspaces, separating the frontend and backend concerns into distinct packages.

### `packages/client` (Frontend)

-   **Framework**: React with TypeScript.
-   **Data Fetching**: Apollo Client for all GraphQL communication with the backend. It handles queries, mutations, caching, and loading/error states.
-   **UI Components**: Built with functional components and React hooks.
-   **Styling**: Tailwind CSS for a utility-first styling approach.
-   **Charting**: Recharts for data visualization.
-   **Build Tool**: Vite for a fast and modern development experience.

### `packages/server` (Backend)

-   **Framework**: Node.js with Express.
-   **API**: A GraphQL API exposed via Apollo Server. It serves as the single entry point for all client data requests.
-   **Language**: TypeScript for type safety and scalability.
-   **Database ORM/Client**: The native `pg` library is used for all communication with the PostgreSQL database.
-   **AI Integration**: A dedicated service securely interacts with the Google Gemini API. The API key is stored server-side and is never exposed to the client.

### `packages/database` (Database)

-   **Engine**: PostgreSQL.
-   **Local Setup**: A `docker-compose.yml` file at the root of the project orchestrates a local PostgreSQL container for development.
-   **Schema**: The database schema is defined in `packages/server/src/db/schema.sql`. It includes tables for `accounts`, `categories`, and `transactions`.
-   **Seeding**: A seed script (`packages/server/src/db/seed.ts`) populates the database with initial sample data.

---

## 2. Local Development Setup

Follow these steps to get the application running on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   Yarn (v1 or later)
-   Docker and Docker Compose

### Step-by-Step Guide

1.  **Clone the Repository**:
    ```bash
    git clone <repository_url>
    cd financial-ai-manager
    ```

2.  **Install Dependencies**:
    Install all dependencies for both the client and server from the root directory.
    ```bash
    yarn install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the `packages/server` directory by copying the example file.
    ```bash
    cp packages/server/.env.example packages/server/.env
    ```
    Now, edit `packages/server/.env` and fill in your details:
    ```env
    # URL for the PostgreSQL database
    DATABASE_URL="postgresql://user:password@localhost:5432/financial_app"

    # Your Google Gemini API Key
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Start the Database**:
    Launch the PostgreSQL container using Docker Compose.
    ```bash
    docker-compose up -d
    ```

5.  **Seed the Database**:
    Run the seed script to create the necessary tables and populate them with sample data.
    ```bash
    yarn db:seed
    ```

6.  **Run the Application**:
    Start both the backend server and the frontend client concurrently.
    ```bash
    yarn dev
    ```
    -   The backend GraphQL server will be available at `http://localhost:4000/graphql`.
    -   The frontend React application will be available at `http://localhost:5173`.

---

## 3. GraphQL API

The API provides a single endpoint for all data operations.

-   **Endpoint**: `http://localhost:4000/graphql`
-   **Tooling**: You can use tools like Apollo Studio Sandbox (available at the endpoint URL in your browser) or Postman to interact with the API.

### Example Query: Fetching Transactions

```graphql
query GetTransactions {
  transactions {
    id
    date
    description
    amount
    category {
      name
    }
    account {
      name
    }
  }
}
```

### Example Mutation: Adding a Transaction

```graphql
mutation AddTransaction {
  addTransaction(input: {
    date: "2024-08-01T00:00:00.000Z",
    description: "New coffee maker",
    amount: -79.99,
    categoryId: "3",
    accountId: "1"
  }) {
    id
    description
    amount
  }
}
```
