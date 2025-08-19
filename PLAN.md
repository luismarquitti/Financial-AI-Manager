### **Project Plan & Status**

#### **Phase 1: Project Setup & Backend Foundation**
**Status: ✅ COMPLETE**

-   [x] **Directory Structure**: Created a Yarn Workspace monorepo with `packages/client` and `packages/server`.
-   [x] **Database Setup (PostgreSQL)**: Added a `docker-compose.yml` for a local Postgres instance, defined the schema, and created a seeding script.
-   [x] **Backend API (GraphQL & Apollo Server)**: Initialized the Node/Express/TypeScript server with a basic Apollo Server setup and a health-check endpoint.
-   [x] **Tooling**: Configured root-level scripts to run the entire stack concurrently.

#### **Phase 2: Backend API Implementation & Frontend Migration**
**Status: ✅ COMPLETE**

-   [x] **Build out GraphQL API**: Expanded the GraphQL schema with all necessary types, queries, and mutations for transactions, accounts, and categories.
-   [x] **Implement Resolvers**: Implemented the resolver functions to perform CRUD operations against the PostgreSQL database.
-   [x] **Secure Gemini Integration**: Moved the Gemini API logic to a dedicated resolver on the server, ensuring the API key remains secure.
-   [x] **Integrate Apollo Client**: Added `@apollo/client` to the `client` package and configured the `ApolloProvider`.
-   [x] **Refactor Frontend Data Fetching**: Replaced all functions in `services/apiService.ts` and `services/geminiService.ts` with GraphQL operations using Apollo Client hooks (`useQuery`, `useMutation`).
-   [x] **Service Cleanup**: Removed the now-redundant mock service files (`apiService.ts`, `geminiService.ts`) from the client.

---

### **🌟 Future Enhancements (Next Steps)**

With the core full-stack architecture now in place, the application is ready for powerful new features. The following enhancements are recommended:

1.  **AI-Powered Transaction Categorization**:
    *   **Goal**: Automate the tedious process of categorizing imported transactions.
    *   **Implementation Idea**: Add an "AI-Categorize" button on the Import page. This would trigger a GraphQL mutation that sends transaction descriptions to the backend. The backend would then use the Gemini API to suggest the most likely category for each transaction based on its description and the user's existing category list. The frontend would then display these suggestions for user confirmation.

2.  **User Authentication**:
    *   **Goal**: Secure the application and provide a personalized experience for multiple users.
    *   **Implementation Idea**: Implement a JWT (JSON Web Token) based authentication system. This would involve adding `User` tables to the database, creating `signup` and `login` mutations in the GraphQL API, and managing the user's authentication state on the client. All API requests would then be protected, ensuring users can only access their own financial data.

3.  **Real-Time Notifications & Alerts**:
    *   **Goal**: Proactively inform users about important financial events.
    *   **Implementation Idea**: Use GraphQL Subscriptions to push real-time updates from the server to the client. This could be used for features like "Large Expense Alerts" or "Upcoming Bill Reminders".

4.  **Data Persistence for Client-Side State**:
    *   **Goal**: Improve user experience by remembering filters and UI state between sessions.
    *   **Implementation Idea**: While the core data is persistent, UI state (like selected filters on the Transactions page) is not. Use a library like `apollo-link-state` or `localStorage` to persist these client-side view preferences.