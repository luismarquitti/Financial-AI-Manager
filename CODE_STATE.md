## Application State: v0.4 (Documentation & Deployment Ready)

This document describes the state of the "Financial AI Manager" application after the addition of comprehensive documentation and deployment artifacts.

### Architecture

- **Full-Stack Monorepo**: The project remains a Yarn Workspaces monorepo (`packages/client`, `packages/server`). The core application architecture is unchanged from v0.3.

### Data Handling

- **GraphQL API as a Single Source of Truth**: Data handling logic remains the same, with the client consuming the backend GraphQL API.

### AI Integration

- **Secure & Server-Side**: The Gemini API integration remains securely on the backend.

### Key Changes from v0.3

- **`docs` Directory**: A new top-level `docs` directory has been created to house all project documentation.
    -   `docs/README.md`: Contains a technical deep-dive into the application's architecture, components, and local setup guide.
    -   `docs/DEPLOYMENT_GUIDE_GCP.md`: Provides a complete, step-by-step guide for deploying the database, backend, and frontend to Google Cloud Platform.
- **`Dockerfile`**: A multi-stage `Dockerfile` has been added to `packages/server`. This file enables the containerization of the backend Node.js application, making it ready for deployment on services like Google Cloud Run.
