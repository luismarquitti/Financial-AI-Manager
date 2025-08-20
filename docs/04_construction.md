# 4. Software Construction

This section covers the standards, tools, and processes related to the development and construction of the Financial AI Manager.

---

### 4.1 Coding Standards and Guidelines

To ensure code quality, consistency, and maintainability, the project adheres to the following standards:

-   **Language:** All code is written in TypeScript. The `strict` mode is enabled in `tsconfig.json` to enforce strong typing.
-   **Formatting:** Code formatting is automated using [Prettier](https://prettier.io/). A uniform style is applied across the entire monorepo. Developers should run `yarn format` before committing code.
-   **Linting:** [ESLint](https://eslint.org/) is used for static code analysis to catch common errors and enforce best practices. The configuration is based on `eslint:recommended` and `plugin:@typescript-eslint/recommended`. Developers should run `yarn lint` to check for issues.
-   **File and Naming Conventions:**
    -   Components: `PascalCase` (e.g., `TransactionTable.tsx`).
    -   Functions/Variables: `camelCase` (e.g., `getFinancialSummary`).
    -   Types/Interfaces: `PascalCase` (e.g., `interface FinancialAnalysis`).
    -   Files: `camelCase` or `kebab-case` for utility files (e.g., `dataAnalyzer.ts`).

---

### 4.2 Technology Stack Justification

| Component | Technology                                        | Rationale                                                                                                                                                             |
| :-------- | :------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | **React, TypeScript**                             | A robust combination for building scalable, type-safe, and maintainable user interfaces. React's component-based model facilitates code reuse and organization.           |
|           | **Vite**                                          | Provides a significantly faster development server and build process compared to older toolchains, improving developer productivity.                                    |
|           | **Apollo Client**                                 | A comprehensive state management library for GraphQL that simplifies data fetching, caching, and synchronization between the client and server.                     |
|           | **Tailwind CSS**                                  | A utility-first CSS framework that enables rapid UI development with a consistent design system directly in the markup, avoiding large custom CSS files.                |
| **Backend**   | **Node.js, Express**                              | A widely adopted, high-performance runtime and framework for building web servers. Its asynchronous, event-driven nature is well-suited for I/O-heavy applications. |
|           | **Apollo Server**                                 | The industry standard for building a GraphQL API in Node.js. It integrates seamlessly with Express and simplifies the implementation of schemas and resolvers.         |
| **Database**  | **PostgreSQL**                                    | A powerful, open-source object-relational database system known for its reliability, feature robustness, and performance. Ideal for handling structured financial data. |
| **AI**        | **Google Gemini API (@google/genai)**             | A powerful, multi-modal AI model capable of complex reasoning and generating structured JSON output, making it ideal for financial analysis and data categorization.      |
| **Tooling**   | **Yarn Workspaces**                               | Manages the monorepo structure, allowing for efficient dependency management and inter-package linking between the client and server.                              |
|           | **Docker**                                        | Containerizes the PostgreSQL database for a consistent, isolated, and easy-to-manage local development environment.                                                 |

---

### 4.3 Development Environment Setup

The complete guide for setting up a local development environment is detailed in the [GCP Deployment Guide under Section 2: Local Development Setup](./07_configuration_management.md#2-local-development-setup).

**Quick Summary:**
1.  **Prerequisites:** Node.js, Yarn, Docker Desktop.
2.  **Clone & Install:** `git clone ...`, `cd ...`, `yarn install`.
3.  **Configure:** Create and fill in `packages/server/.env` from the example file.
4.  **Start Database:** `docker compose up -d`.
5.  **Seed Database:** `yarn db:seed`.
6.  **Run App:** `yarn dev`.

---

### 4.4 Key Code Structures/Patterns

-   **Service Layer (Backend):** Business logic is abstracted into a service layer (`packages/server/src/services`). For example, `dbService.ts` contains all database interaction logic, and `geminiService.ts` contains all logic for interacting with the Gemini API. This keeps the GraphQL resolvers clean and focused on orchestrating calls to these services.
-   **React Hooks:** The frontend makes extensive use of React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) for managing component state and side effects.
-   **Custom Hooks (Future):**
    > **[TODO]**: As the application grows, complex or repeated logic should be extracted into custom hooks (e.g., `useFilterState`) to improve reusability and separation of concerns.
-   **Centralized API Queries:** All GraphQL queries and mutations are defined in a single location (`packages/client/src/graphql/queries.ts`), making them easy to find and manage.
