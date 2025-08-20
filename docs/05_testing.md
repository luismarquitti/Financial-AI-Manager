# 5. Software Testing

This section outlines the testing strategy, types of tests performed, and quality metrics for the Financial AI Manager.

---

### 5.1 Test Strategy and Types

The project employs a multi-layered testing strategy to ensure code quality and prevent regressions. The testing framework is built on **Jest** and **React Testing Library**.

| Test Type             | Description                                                                                                                                                  | Location / Tooling                                  | Coverage                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------- |
| **Unit Testing**      | Tests individual functions or components in isolation to verify they work as expected. Dependencies are mocked to ensure the test focuses on a single "unit". | `packages/server`: Jest <br/> `packages/client`: React Testing Library | Key backend services (`dbService`), utility functions, and presentational UI components. |
| **Integration Testing** | > **[TODO]**: To be implemented. Tests interactions between multiple components or services, such as a GraphQL resolver calling a database service.        | `packages/server`: Jest with a test database.         | Critical API endpoints and complex component interactions.           |
| **End-to-End (E2E) Testing** | > **[TODO]**: To be implemented. Simulates real user scenarios by running tests in a browser, covering complete user flows from start to finish.      | Frameworks like Cypress or Playwright.                | Core user journeys (e.g., file upload -> dashboard view).             |
| **Static Testing**    | Automated analysis of source code without executing it. This is handled by the linter and type checker.                                                        | TypeScript Compiler (TSC), ESLint                   | The entire codebase.                                                  |

---

### 5.2 Test Environment Setup

-   **Framework:** Jest is configured at the root level and runs tests across both the `client` and `server` workspaces.
-   **Client Environment:** `jsdom` is used to simulate a browser environment for React component tests.
-   **Server Environment:** A Node.js environment is used. The `pg` (PostgreSQL) library is mocked to allow `dbService` to be tested without a live database connection, ensuring tests are fast and isolated.

**Running Tests:**
-   `yarn test`: Runs all tests across the monorepo.
-   `yarn test:watch`: Runs tests in interactive watch mode.
-   `yarn test:coverage`: Runs all tests and generates a code coverage report in the `coverage/` directory.

---

### 5.3 Quality Metrics

The following metrics are used to assess the quality and stability of the application.

| Metric               | Target  | Description                                                                                                                             |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Code Coverage**    | **>80%** | The percentage of code lines executed by the automated test suite. The target applies to critical business logic and UI components.     |
| **Linting Errors**   | **0**   | The codebase must pass all ESLint rules without any errors before a pull request can be merged.                                           |
| **TypeScript Errors**| **0**   | The project must compile without any TypeScript errors.                                                                                 |
| **Build Status**     | **Green**| The CI/CD pipeline (including build and test steps) must pass for all main branches.                                                   |
| **Bug Escape Rate**  | **<5%**  | > **[TODO]**: To be tracked. The percentage of bugs found in production versus those found during development and testing phases.         |
