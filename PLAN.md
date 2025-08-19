### **High-Level Plan: From React App to Full-Stack Monorepo**

Our goal is to create a monorepo structure using Yarn Workspaces. This will house our backend (`server`) and frontend (`client`) in a single repository, making development and dependency management streamlined.

1.  **Project Restructuring (Monorepo)**: We will organize the project into two main packages:
    *   `packages/client`: Our existing React application.
    *   `packages/server`: The new backend service.

2.  **Backend Development (`server`)**: We'll build a Node.js/Express server that:
    *   Connects securely to a PostgreSQL database.
    *   Exposes a GraphQL API using Apollo Server for all data operations.
    *   Handles all interactions with the Google Gemini API, keeping the `API_KEY` secure on the server.

3.  **Frontend Refactoring (`client`)**: We will update the React app to:
    *   Remove the mock API service (`apiService.ts`).
    *   Use Apollo Client to communicate with our new GraphQL backend for all data (transactions, categories, etc.).
    *   Request AI analysis from our backend instead of calling the Gemini API directly.

4.  **Local Development Environment**: We'll set up a seamless local development experience using:
    *   `docker-compose` to run a PostgreSQL database instance easily.
    *   A `.env` file to manage environment variables like database connection strings and API keys.
    *   `concurrently` to run both the client and server with a single command.

---

### **Detailed Implementation Strategy**

#### **Phase 1: Project Setup & Backend Foundation**

1.  **Directory Structure**:
    *   Create a root `package.json` configured for Yarn Workspaces.
    *   Move the current React application into a `packages/client` directory.
    *   Create a new `packages/server` directory and initialize a TypeScript Node.js project inside it.

2.  **Database Setup (PostgreSQL)**:
    *   **Docker**: I'll provide a `docker-compose.yml` file. Running `docker-compose up` will start a local PostgreSQL server with a persistent volume for your data.
    *   **Schema**: We will define the SQL schema for our tables: `transactions`, `categories`, and `accounts`. I'll also create a seeding script to populate the database with the initial data from your `transactions.json`.
    *   **Connection**: The server will use the `pg` library to connect to the database, with credentials managed via the `.env` file.

3.  **Backend API (GraphQL & Apollo Server)**:
    *   **Structure**: The `packages/server/src` directory will be organized with clear separation of concerns:
        *   `db/`: For database connection logic and seeding.
        *   `graphql/`: To define our GraphQL schema (`typeDefs`) and implement the business logic for each query/mutation (`resolvers`).
        *   `index.ts`: The server entry point, setting up Express and Apollo Server.
    *   **Schema Definition**: We will define GraphQL types and operations:
        *   **Types**: `Transaction`, `Category`, `Account`, `AISummary`.
        *   **Queries**: `transactions`, `categories`, `accounts`, `getAiSummary`.
        *   **Mutations**: `addTransaction`, `updateTransaction`, `deleteTransaction`, `addCategory`, etc.
    *   **Secure Gemini Integration**: The `getAiSummary` resolver on the server will be the *only* place that communicates with the Google Gemini API. It will securely read `process.env.API_KEY` from the server's environment, ensuring the key is never exposed to the browser.

#### **Phase 2: Frontend Migration to Apollo Client**

1.  **Integrate Apollo Client**:
    *   Add `@apollo/client` and `graphql` as dependencies to the `packages/client` app.
    *   Wrap the root `App` component with an `ApolloProvider` to make the client available throughout the component tree.
    *   Configure the client to point to our local GraphQL server endpoint (e.g., `http://localhost:4000/graphql`).

2.  **Refactor Data Fetching**:
    *   Replace all functions in `services/apiService.ts` with GraphQL operations.
    *   **Reading Data**: Use the `useQuery` hook from Apollo Client to fetch transactions, categories, and accounts. This provides caching, loading, and error states out-of-the-box.
    *   **Writing Data**: Use the `useMutation` hook for all create, update, and delete operations. This allows us to easily update the local cache after a mutation succeeds, ensuring the UI reflects the changes instantly.

#### **Phase 3: Tooling & Deployment Readiness**

1.  **Environment Configuration**:
    *   The `packages/server` directory will contain a `.env.example` file outlining the needed variables (`DATABASE_URL`, `API_KEY`). You will create your own `.env` file based on it.

2.  **Development Scripts**:
    *   The root `package.json` will have scripts to manage the whole stack:
        *   `yarn install`: Installs dependencies for both client and server.
        *   `yarn dev`: Starts the backend server and frontend dev server concurrently.
        *   `yarn build`: Builds both client and server for production.

3.  **Deployment Plan**:
    *   **Server**: The server can be deployed as a standard Node.js application to services like Vercel, Heroku, or Google Cloud Run. It will need to be configured with production environment variables.
    *   **Client**: The client can be deployed as a static website to services like Vercel or Netlify. The build process will generate a highly optimized set of static assets.
    *   **CORS**: The Express server will be configured with CORS (Cross-Origin Resource Sharing) to accept requests from the deployed frontend URL.