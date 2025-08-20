## Application State: v0.6.0 (Testing & Linting Framework)

This document describes the state of the "Financial AI Manager" application after the integration of a comprehensive testing and code quality framework.

### Architecture

-   **Full-Stack Monorepo**: The project remains a Yarn Workspaces monorepo. The core application architecture is unchanged.

### Key Changes from v0.5.0

-   **Code Quality & Linting**:
    -   **ESLint**: Integrated throughout the monorepo to enforce a consistent coding style and catch potential errors early. A root configuration provides the base, with package-specific overrides for Node.js (`server`) and React (`client`).
    -   **Prettier**: Added to automatically format the entire codebase, ensuring a uniform style.
    -   **Root Scripts**: New scripts (`format`, `lint`, `lint:fix`) have been added to the root `package.json` for easy execution of these tools across all workspaces.

-   **Unit Testing**:
    -   **Jest**: The Jest testing framework has been configured for the entire monorepo.
    -   **React Testing Library**: The `client` package is now equipped with React Testing Library for component testing.
    -   **Server-Side Mocking**: Implemented a manual mock for the `pg` (PostgreSQL) library, allowing for isolated unit tests of the database service layer without requiring a live database connection.
    -   **Example Tests**: Added initial unit tests for a client-side component (`SummaryCard.tsx`) and a server-side service (`dbService.ts`) to serve as a template for future test development.
    -   **Root Scripts**: New scripts (`test`, `test:watch`, `test:coverage`) have been added to the root `package.json` to run tests across the project.
