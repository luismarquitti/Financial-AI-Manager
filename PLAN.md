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

#### **Phase 3: Documentation & Deployment**
**Status: ✅ COMPLETE**
-   [x] **Dockerfile**: Created a multi-stage `Dockerfile` for containerizing the backend service.
-   [x] **Technical Documentation**: Added `docs/README.md` with a detailed overview of the project architecture and local setup instructions.
-   [x] **Deployment Guide**: Added `docs/DEPLOYMENT_GUIDE_GCP.md` with comprehensive steps for deploying the entire application stack to Google Cloud Platform.
-   [x] **Cost Estimation**: Enhanced the GCP deployment guide with a detailed cost breakdown and free tier analysis for all required services.
-   [x] **Enhanced Local Dev Docs**: Improved the local development setup guide with detailed Docker instructions for Windows and a robust `docker-compose.yml`.

#### **Phase 4: AI-Enhancement - AI-Powered Transaction Categorization**
**Status: IN PROGRESS**

-   **Goal**: Significantly reduce manual data entry by automatically suggesting categories for uncategorized transactions during the file import process.

-   **High-Level Workflow**: The user uploads a file, navigates to the "Import" page, and clicks a "✨ Suggest Categories" button. The application sends the descriptions of all uncategorized transactions to the backend. The backend uses the Gemini API to determine the best category for each transaction and sends the suggestions back. The frontend then automatically populates the "Category" dropdown for each of those transactions, allowing the user to quickly review, adjust if necessary, and save.

---

##### **Part 1: Backend Implementation (GraphQL & Gemini Service)**
**Status: ✅ COMPLETE**

1.  **[x] GraphQL Schema Enhancement**:
    -   [x] Define a new mutation in `packages/server/src/graphql/schema.ts`:
        ```graphql
        suggestCategories(transactions: [SuggestTransactionCategoryInput!]!): [SuggestedCategory!]!
        ```
    -   [x] Create the required input and output types:
        ```graphql
        input SuggestTransactionCategoryInput {
          id: String! # A temporary ID from the client (e.g., 'import-1')
          description: String!
        }

        type SuggestedCategory {
          transactionId: String!
          categoryId: ID!
          categoryName: String!
        }
        ```

2.  **[x] New Gemini Service Logic**:
    -   [x] In `packages/server/src/services/geminiService.ts`, create a new exported function: `suggestTransactionCategories`.
    -   [x] This function will accept two arguments: an array of transaction objects (`{ id, description }`) and an array of all available user-defined categories (`{ id, name }`).
    -   [x] It will construct a highly specific prompt for the `gemini-2.5-flash` model. The prompt will instruct the AI to act as a financial assistant and match each transaction description to one of the provided category names.
    -   [x] Crucially, it will use a `responseSchema` to enforce a strict JSON output, ensuring the response is always parseable. The schema will define an array of objects, like:
        ```json
        // responseSchema example
        {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              transactionId: { type: Type.STRING },
              categoryName: { type: Type.STRING }
            }
          }
        }
        ```

3.  **[x] Resolver Implementation**:
    -   [x] In `packages/server/src/graphql/resolvers.ts`, implement the resolver for the `suggestCategories` mutation.
    -   [x] The resolver will first call the `dbService` to fetch all existing categories from the database.
    -   [x] It will then pass the input transactions and the fetched categories to the new `geminiService.suggestTransactionCategories` function.
    -   [x] Finally, it will process the AI's response, mapping the suggested `categoryName` for each transaction back to its corresponding category `id` from the database before returning the `SuggestedCategory` array.

---

##### **Part 2: Frontend Implementation (React & Apollo Client)**

1.  **UI Enhancements in `ImportPage.tsx`**:
    -   Add a new, visually distinct button: `✨ Suggest Categories`.
    -   This button will have loading and disabled states managed by a new state variable (e.g., `isSuggestingCategories`).

2.  **Apollo Client Mutation**:
    -   Define the `SUGGEST_CATEGORIES` mutation in `packages/client/src/graphql/queries.ts`.
    -   In `ImportPage.tsx`, create a `useMutation` hook for this new mutation.

3.  **State Management & Logic**:
    -   The `onClick` handler for the "Suggest Categories" button will:
        1.  Filter the `stagedTransactions` state to get a list of all transactions that do not currently have a `category` assigned.
        2.  Call the `suggestCategories` mutation with the filtered list, sending only the `id` and `description`.
        3.  When the mutation returns the suggestions, update the `stagedTransactions` state. It will iterate through the suggestions and find the matching transaction in the state by its `id`, then update its `category` object with the suggested `{ id, name }`.

4.  **Editable `TransactionTable.tsx`**:
    -   The "Category" and "Account" columns on the import page need to be interactive.
    -   Modify the `TransactionTable.tsx` component. When a new prop `isEditable` is true, the cells for `category` and `account` will render as `<select>` dropdowns instead of static text.
    -   The `ImportPage.tsx` will be responsible for handling the `onChange` events for these dropdowns and updating the `stagedTransactions` state accordingly.
    -   A small "✨" icon will be displayed next to the category name if it was suggested by the AI (this requires adding a temporary flag to the transaction state object).

---

##### **Part 3: User Workflow & Experience**

1.  **End-to-End Flow**:
    -   User uploads a CSV/XLSX file.
    -   The `ImportPage` displays the staged transactions, many with empty category/account dropdowns.
    -   User clicks "✨ Suggest Categories". A loading indicator appears on the button.
    -   After a few moments, the "Category" dropdown for the relevant rows automatically selects the AI's suggestions.
    -   The user can now review the suggestions, manually override any they disagree with using the dropdown, and assign categories to any that the AI missed.
    -   The user clicks "Save Selected to Database" to finalize the import.

2.  **Feedback & Error Handling**:
    -   Implement clear loading states on the suggestion button and potentially a subtle loading indicator on the table rows being processed.
    -   Gracefully handle any potential API errors from the Gemini service and display a user-friendly notification (e.g., a toast or an alert message) if the categorization fails.

---

### **🌟 Future Enhancements (Next Steps)**

With the core full-stack architecture now in place, the application is ready for powerful new features. The following enhancements are recommended:

1.  **User Authentication**:
    *   **Goal**: Secure the application and provide a personalized experience for multiple users.
    *   **Implementation Idea**: Implement a JWT (JSON Web Token) based authentication system. This would involve adding `User` tables to the database, creating `signup` and `login` mutations in the GraphQL API, and managing the user's authentication state on the client. All API requests would then be protected, ensuring users can only access their own financial data.

2.  **Real-Time Notifications & Alerts**:
    *   **Goal**: Proactively inform users about important financial events.
    *   **Implementation Idea**: Use GraphQL Subscriptions to push real-time updates from the server to the client. This could be used for features like "Large Expense Alerts" or "Upcoming Bill Reminders".

3.  **Data Persistence for Client-Side State**:
    *   **Goal**: Improve user experience by remembering filters and UI state between sessions.
    *   **Implementation Idea**: While the core data is persistent, UI state (like selected filters on the Transactions page) is not. Use a library like `apollo-link-state` or `localStorage` to persist these client-side view preferences.