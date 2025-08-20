# Project Plan: Financial AI Manager

This document provides a high-level strategic overview of the Financial AI Manager project. It serves as a single source of truth for our vision, major initiatives, and architectural principles.

**Detailed user stories, technical tasks, and sprint planning are managed in our GitHub Project board.**

---

### Vision & Current State

The Financial AI Manager is a full-stack, AI-powered web application designed to provide users with intelligent, automated analysis of their personal financial transactions.

Our current application provides a robust foundation built on a PERN (PostgreSQL, Express, React, Node) stack with a GraphQL API. Key existing capabilities include:
-   **Full CRUD Functionality:** Complete management of transactions, accounts, and categories.
-   **Interactive Dashboard:** Rich data visualizations and a powerful AI-driven financial summary via the Gemini API.
-   **Flexible Data Ingestion:** Support for both file uploads (`.csv`, `.xlsx`) and a direct database connection.
-   **Quality Framework:** A comprehensive testing and linting framework ensures code quality and stability.
-   **Production-Ready:** The application is fully containerized and includes a detailed deployment guide for Google Cloud Platform.

---

### Strategic Initiatives (Epics)

Our development is organized around the following strategic epics. These represent the major areas of focus for improving and extending the application's capabilities.

#### 1. Foundational Excellence & DevOps
-   **Goal:** To ensure the application remains scalable, maintainable, secure, and easy to deploy.
-   **Key Features:** This involves enhancing our CI/CD pipelines, expanding test coverage across all layers of the stack (Unit, Integration, E2E), and continuously improving our documentation and monitoring strategies.

#### 2. Advanced Credit Card Management
-   **Goal:** To introduce a best-in-class feature set for tracking and managing credit card spending.
-   **Key Features:**
    -   **Credit Card Accounts:** Users can define accounts with specific closing and payment due dates.
    -   **Installment Tracking:** Simple entry and automatic creation of transactions for installment-based purchases.
    -   **Statement Dashboards:** A dedicated view for each credit card, showing current statement details, historical spending trends, and upcoming installments.

#### 3. AI-Powered Enhancements
-   **Goal:** To further leverage AI to automate manual tasks and provide deeper financial insights.
-   **Key Features:**
    -   **AI Transaction Categorization:** Automatically suggest categories for imported transactions to streamline the onboarding process.
    -   **Predictive Analysis:** (Future) Analyze trends to provide forward-looking insights and budget forecasting.

---

### Detailed Task Breakdown

This section contains a detailed breakdown of tasks, which can be used to populate the GitHub Project board.

#### Epic 1: Foundational Excellence & DevOps

*   **Title:** Establish and Maintain a Robust, Scalable, and Well-Documented Application Foundation
*   **Description:** This epic covers all foundational work required to ensure the application is secure, maintainable, testable, and easily deployable. It encompasses architecture, CI/CD, documentation, and quality assurance.
*   **Labels:** `epic`, `devops`, `quality`, `documentation`

    ---

    ##### Feature: Comprehensive Testing Framework
    *   **Title:** Implement and Maintain a Multi-Layered Testing Strategy
    *   **Labels:** `feature`, `quality`, `testing`
    *   **Effort:** L

        *   **User Story:** As a developer, I want a comprehensive unit test suite for all critical services and components, so that I can refactor code with confidence and prevent regressions.
            *   **Description:** Write unit tests for all backend services, GraphQL resolvers, and key utility functions. Ensure mocks are used for external dependencies like the database and Gemini API.
            *   **Acceptance Criteria:**
                1.  All functions in `dbService.ts` and `geminiService.ts` have corresponding unit tests.
                2.  All major UI components (`Dashboard`, `TransactionTable`, `SettingsList`) have unit tests covering their primary states and interactions.
                3.  Code coverage for critical business logic exceeds 80%.
            *   **Labels:** `user-story`, `testing`, `backend`, `frontend`, `quality`
            *   **Effort:** L

        *   **Technical Task:** Set up and configure an integration testing environment.
            *   **Description:** Configure a separate test database that can be seeded and torn down by the test runner. This will allow for testing the interaction between GraphQL resolvers and the database service.
            *   **Labels:** `technical-task`, `testing`, `backend`, `devops`
            *   **Effort:** M

        *   **User Story:** As a QA Engineer, I want an end-to-end (E2E) test suite for core user journeys, so that I can automatically verify that critical application flows are working correctly in a real browser environment.
            *   **Description:** Implement E2E tests for user journeys like: 1) Uploading a file and importing transactions, and 2) Adding, editing, and deleting a transaction from the UI.
            *   **Labels:** `user-story`, `testing`, `e2e`
            *   **Effort:** L

    ---

    ##### Feature: CI/CD & Production Readiness
    *   **Title:** Automate and Standardize Build, Test, and Deployment Pipelines
    *   **Labels:** `feature`, `devops`, `ci-cd`
    *   **Effort:** M

        *   **Technical Task:** Implement CI pipeline using GitHub Actions.
            *   **Description:** Create a GitHub Actions workflow that triggers on every pull request. The workflow must run linting, formatting checks, and all unit tests for both the client and server.
            *   **Labels:** `technical-task`, `devops`, `ci-cd`
            *   **Effort:** M

        *   **Technical Task:** Implement CD pipeline to GCP using GitHub Actions.
            *   **Description:** Create a workflow that triggers on merge to the `main` branch. It should build and push the server's Docker image to Artifact Registry and deploy the new revision to Cloud Run. It should also build and deploy the client to Cloud Storage.
            *   **Labels:** `technical-task`, `devops`, `ci-cd`, `gcp`
            *   **Effort:** M

    ---

#### Epic 2: Advanced Credit Card Management

*   **Title:** Introduce Comprehensive Credit Card Tracking and Management
*   **Description:** This epic covers the end-to-end implementation of features allowing users to manage credit cards, track statements, and handle installment purchases.
*   **Labels:** `epic`, `enhancement`

    ---

    ##### Feature: Credit Card Data Model & Settings
    *   **Title:** Allow Users to Create and Manage Credit Card Accounts
    *   **Labels:** `feature`, `backend`, `frontend`, `ux`
    *   **Effort:** M

        *   **Technical Task:** Update Database Schema for Credit Card Accounts.
            *   **Description:** Modify the `accounts` table to include `account_type` (e.g., 'checking', 'credit_card'), `closing_day` (integer), and `payment_due_day` (integer). These new fields should be nullable.
            *   **Labels:** `technical-task`, `backend`, `database`
            *   **Effort:** S

        *   **Technical Task:** Update GraphQL Schema and Resolvers for Credit Card Accounts.
            *   **Description:** Extend the `Account` type in the GraphQL schema to include the new fields. Update the `addAccount` and `updateAccount` mutations and their corresponding resolvers to handle these new properties.
            *   **Labels:** `technical-task`, `backend`, `graphql`
            *   **Effort:** S

        *   **User Story:** As a user, I want to designate an account as a "Credit Card" in the settings, so that I can specify its closing and payment due dates for accurate tracking.
            *   **Description:** In the Settings > Accounts UI, when adding or editing an account, provide a dropdown to select the account type. If "Credit Card" is selected, dynamically show input fields for "Closing Day" and "Payment Due Day".
            *   **Acceptance Criteria:**
                1.  An "Account Type" dropdown is available in the account creation/edit form.
                2.  Selecting "Credit Card" reveals the "Closing Day" and "Payment Due Day" fields.
                3.  Saving a credit card account correctly persists the new properties in the database.
            *   **Labels:** `user-story`, `frontend`, `settings`, `ux`
            *   **Effort:** M

    ---

    ##### Feature: Installment Purchase Tracking
    *   **Title:** Enable Users to Record and Track Purchases Made in Installments
    *   **Labels:** `feature`, `backend`, `frontend`
    *   **Effort:** L

        *   **Technical Task:** Update Database Schema for Installments.
            *   **Description:** Add `installment_group_id` (UUID, nullable) and `installment_number` (e.g., "1 of 12") fields to the `transactions` table.
            *   **Labels:** `technical-task`, `backend`, `database`
            *   **Effort:** S

        *   **Technical Task:** Implement Backend Logic for Installment Creation.
            *   **Description:** When a transaction is created with an installment option, the backend resolver must generate all subsequent monthly transaction records. Each will share the same `installment_group_id` and have a unique date and `installment_number`.
            *   **Labels:** `technical-task`, `backend`, `graphql`
            *   **Effort:** M

        *   **User Story:** As a user adding a new transaction, I want to specify if it's an installment purchase and enter the total number of installments, so that the system automatically creates all future payments for me.
            *   **Description:** In the "Add Transaction" modal, add a checkbox for "Is this an installment purchase?". If checked, show a number input for "Number of Installments".
            *   **Acceptance Criteria:**
                1.  The installment option is present in the transaction modal.
                2.  When a 3-installment purchase of $300 is created on Jan 15, three transactions of -$100 are created on Jan 15, Feb 15, and Mar 15.
                3.  All three transactions are linked visually or by data in the transaction list.
            *   **Labels:** `user-story`, `frontend`, `transactions`
            *   **Effort:** M

    ---

    ##### Feature: Credit Card Statement Dashboard
    *   **Title:** Provide a Dedicated View for Analyzing Credit Card Statements
    *   **Labels:** `feature`, `frontend`, `ux`
    *   **Effort:** XL

        *   **Technical Task:** Create New GraphQL Queries for Statement Data.
            *   **Description:** Develop new GraphQL queries to fetch transactions for a specific credit card account within a given statement period (between two closing dates). Also, create a query to fetch a summary of past statement totals.
            *   **Labels:** `technical-task`, `backend`, `graphql`
            *   **Effort:** M

        *   **User Story:** As a user, I want to click on a credit card account and see a dedicated dashboard for it, so that I can understand my spending for the current statement period.
            *   **Description:** Create a new page/view for credit card accounts. This view should display the current statement's closing date, due date, and total balance. It should also list all transactions within the current statement period.
            *   **Acceptance Criteria:**
                1.  Credit card accounts in lists are clickable and navigate to the new dashboard.
                2.  The dashboard correctly calculates the date range for the current open statement based on the account's closing day.
                3.  The total balance and transaction list accurately reflect the purchases for that period.
            *   **Labels:** `user-story`, `frontend`, `dashboard`, `ux`
            *   **Effort:** L

        *   **User Story:** As a user on the credit card dashboard, I want to see a chart of my last 12 closed statement totals, so that I can track my spending trends over time.
            *   **Description:** Add a bar chart to the credit card dashboard that visualizes the total amount for each of the last 12 closed statements.
            *   **Acceptance Criteria:**
                1.  A bar chart is present on the credit card dashboard.
                2.  The chart correctly displays 12 bars, each representing a past statement total.
                3.  Hovering over a bar shows the exact total and statement period.
            *   **Labels:** `user-story`, `frontend`, `dashboard`, `visualization`
            *   **Effort:** M
