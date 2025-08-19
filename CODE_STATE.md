## Application State: v0.3 (Fully Integrated Full-Stack App)

This document describes the state of the "Financial AI Manager" application after the full integration between the frontend and backend.

### Architecture

- **Full-Stack Monorepo**: The project remains a Yarn Workspaces monorepo (`packages/client`, `packages/server`).
- **Backend**: The Node.js server now features a complete GraphQL API with comprehensive queries and mutations for managing all application data. The API is fully connected to the PostgreSQL database.
- **Frontend**: The React client has been refactored to be a consumer of the GraphQL API. It uses Apollo Client for all data fetching and state management related to server data.
- **Database**: The PostgreSQL database schema is unchanged and serves as the single source of truth for the application.

### Data Handling

- **GraphQL API as a Single Source of Truth**: The client no longer contains any mock data or services. All data is fetched from the backend via GraphQL operations. The API provides full CRUD capabilities for transactions, categories, and accounts.
- **Client-Side State Management**: The client now uses `@apollo/client` for all remote data management. This includes caching, loading, and error states, which simplifies component logic significantly. Local UI state is still managed with React hooks (`useState`, `useMemo`).
- **Data Flow**:
    1. A React component calls a `useQuery` or `useMutation` hook.
    2. Apollo Client sends a GraphQL request to the `http://localhost:4000/graphql` endpoint.
    3. The Apollo Server on the backend receives the request and executes the corresponding resolver.
    4. The resolver calls a database service function, which runs a SQL query against the PostgreSQL database.
    5. The data is returned up the chain to the client, where Apollo Client updates its cache and re-renders the component with the new data.

### AI Integration

- **Secure & Server-Side**: The Google Gemini API integration is now fully implemented on the backend (`packages/server/src/services/geminiService.ts`). The `aiSummary` GraphQL query triggers this service, ensuring the API key is never exposed to the client. The client simply queries for the `aiSummary` and displays the result.

### Key Changes from v0.2

- The mock services (`apiService.ts`, `geminiService.ts`) in the client have been **deleted**.
- The GraphQL schema and resolvers in the server have been fully built out.
- A database service layer has been added to the server to manage SQL queries.
- The entire client application (`App.tsx` and its children) has been refactored to use Apollo Client hooks (`useQuery`, `useMutation`, `useLazyQuery`).
- The client now depends on a running backend server for all of its data.