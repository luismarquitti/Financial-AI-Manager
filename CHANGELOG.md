# Changelog

## v0.4.2 - Local Development Documentation Enhancement
*Date: 2024-07-28*

### Added
- **Docker Compose**: Added a `docker-compose.yml` file to the project root to provide a consistent and persistent PostgreSQL database for local development.

### Changed
- **Technical Documentation**: Substantially updated `docs/README.md` with a more detailed and user-friendly "Local Development Setup" section. It now includes step-by-step instructions for installing and verifying Docker on Windows and a full explanation of the new Docker Compose configuration.

---

## v0.4.1 - GCP Cost Documentation
*Date: 2024-07-27*

### Changed
- **GCP Deployment Guide**: Enhanced `docs/DEPLOYMENT_GUIDE_GCP.md` with a new section detailing the estimated costs, pricing models, and free tier limits for all Google Cloud services used in the deployment.

---

## v0.4.0 - Documentation & Deployment Readiness
*Date: 2024-07-27*

### Added
- **Documentation Hub**: Created a new `docs/` directory to centralize project documentation.
- **Technical Documentation**: Added a detailed `docs/README.md` file covering the application's architecture, local development setup, and API usage.
- **GCP Deployment Guide**: Created a comprehensive `docs/DEPLOYMENT_GUIDE_GCP.md` with step-by-step instructions for deploying the entire stack (PostgreSQL, Node.js API, React Frontend) to Google Cloud Platform.
- **Server Dockerfile**: Added a multi-stage `Dockerfile` to `packages/server` to containerize the backend service for production deployment.

---

## v0.3.0 - Full API Implementation & Frontend Integration
*Date: 2024-07-26*

### Added
- **Full GraphQL API**: Implemented a comprehensive set of GraphQL queries and mutations on the server for full CRUD functionality on transactions, categories, and accounts.
- **Database Service Layer**: Created a service layer on the backend to abstract all PostgreSQL database interactions.
- **Server-Side Gemini Service**: Moved the Gemini API logic entirely to the backend, ensuring the API key is secure. Added an `aiSummary` GraphQL query.
- **Apollo Client**: Integrated Apollo Client into the React application for all data fetching and state management.

### Changed
- **Frontend Data Fetching**: Completely refactored the frontend to use Apollo Client hooks (`useQuery`, `useMutation`, `useLazyQuery`) instead of the mock API service.
- **Application Logic**: The client is now a pure consumer of the backend API, completing the full-stack architecture.

### Removed
- **Mock Services**: Deleted `apiService.ts` and `geminiService.ts` from the client package, as their functionality is now handled by the backend.

---

## v0.2.0 - Full-Stack Architecture Migration
*Date: 2024-07-26*

### Added
- **Monorepo Structure**: Project restructured into a Yarn Workspaces monorepo with `packages/client` and `packages/server`.
- **Backend Server**: Added a new Node.js, Express, and TypeScript server in `packages/server`.
- **GraphQL API**: Integrated Apollo Server to expose a basic GraphQL endpoint.
- **PostgreSQL Database**: Added a `docker-compose.yml` for a PostgreSQL database.
- **Database Schema & Seeding**: Created an SQL schema and a seeding script to populate the database from the existing `transactions.json`.
- **Tooling**: Added `concurrently` to run both client and server with `yarn dev`. The client now uses `Vite` for its development server.

### Changed
- **Architecture**: Migrated from a client-side only application to a full-stack application.
- All frontend source files moved from the root into the `packages/client` directory.
- Client-side dependencies are now managed in `packages/client/package.json` instead of a browser `importmap`.

---

## v0.1.0 - Initial Setup & Full-Stack Plan
*Date: 2024-07-26*

### Added
- **Project Scaffolding**: Established the initial client-side React application.
- **PLAN.md**: Created the architectural plan for migrating the application to a full-stack PERN (PostgreSQL, Express, React, Node) monorepo with GraphQL.
- **CODE_STATE.md**: Documented the initial state of the application as a client-side only demo.
- **CHANGELOG.md**: This file was created to track the history of changes.
