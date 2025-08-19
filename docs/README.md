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
-   Docker Desktop

### Step 1: Install & Verify Docker (for Windows)

The local database runs inside a Docker container, so you need Docker Desktop installed and running.

1.  **Download and Install**: Download Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop/). The installer will guide you through the process. It will likely require you to enable the WSL 2 (Windows Subsystem for Linux) feature, which is a standard part of modern Windows systems.
2.  **Start Docker Desktop**: Once installed, launch the Docker Desktop application. You should see the Docker icon in your system tray. Wait for it to show a steady green light, indicating it's running.
3.  **Verify Installation**: Open a terminal (PowerShell or Command Prompt) and run the following commands to ensure Docker is working correctly:
    ```bash
    # Check the Docker Engine version
    docker --version

    # Check the Docker Compose version
    docker compose version
    ```
    You should see version numbers printed for both commands.

> **Note on `docker compose`**: Modern versions of Docker integrate `compose` as a direct command (`docker compose`). Older versions used a hyphenated command (`docker-compose`). This guide uses the modern syntax. If you have an older version, simply add a hyphen to the command.

### Step 2: Clone & Install Dependencies

1.  **Clone the Repository**:
    ```bash
    git clone <repository_url>
    cd financial-ai-manager
    ```

2.  **Install Dependencies**:
    From the root directory, install all dependencies for both the client and server.
    ```bash
    yarn install
    ```

### Step 3: Configure Environment Variables

Create a `.env` file in the `packages/server` directory by copying the example file.
```bash
cp packages/server/.env.example packages/server/.env
```
Now, edit `packages/server/.env` and fill in your details. The `DATABASE_URL` is already configured for the local Docker setup.
```env
# URL for the PostgreSQL database (matches docker-compose.yml)
DATABASE_URL="postgresql://user:password@localhost:5432/financial_app"

# Your Google Gemini API Key
API_KEY="YOUR_GEMINI_API_KEY"
```

### Step 4: Start the Database with Docker Compose

This command reads the `docker-compose.yml` file at the project root and starts the PostgreSQL database container in the background.

```bash
docker compose up -d
```
The first time you run this, it will download the PostgreSQL image, which may take a few moments.

#### Understanding the `docker-compose.yml` File
This file defines the local database service, ensuring a consistent setup.
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: financial_app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data: {}
```
-   **`image`**: Specifies the official lightweight PostgreSQL version 14 image.
-   **`restart: always`**: Ensures the database container automatically restarts if it crashes or if you restart your machine.
-   **`environment`**: Sets the username, password, and database name. These values match the `DATABASE_URL` in the `.env` file.
-   **`ports`**: Maps port `5432` inside the container to port `5432` on your local machine, allowing the backend server to connect.
-   **`volumes`**: Creates a persistent, named volume (`postgres_data`). This is crucial as it stores your database data outside the container, **preventing data loss** when you stop or rebuild the container.

### Step 5: Seed the Database

Run the seed script to create the necessary tables and populate them with sample data.
```bash
yarn db:seed
```

### Step 6: Run the Application

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
