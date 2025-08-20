# 1. Introduction & Overview

This section provides a high-level introduction to the Financial AI Manager application.

---

### 1.1 Purpose, Scope, and Vision

**Purpose**
The Financial AI Manager is an intelligent web application designed to help individuals analyze and understand their personal financial transactions. By leveraging the Google Gemini API, it automates the process of summarizing financial health, identifying spending trends, and providing actionable insights.

**Scope**
The application's scope covers the entire lifecycle of personal transaction management:
-   **Data Ingestion:** Users can either connect to a pre-populated database or upload their own transaction history via `.csv` or `.xlsx` files.
-   **Data Management:** Full CRUD (Create, Read, Update, Delete) capabilities for transactions, financial accounts (e.g., checking, savings), and spending categories.
-   **Analysis & Visualization:** An interactive dashboard provides a high-level overview with summary cards, monthly income vs. expense charts, and a category breakdown pie chart.
-   **AI-Powered Insights:** A core feature is the automated generation of a financial summary, including income/expense analysis and actionable advice for financial improvement.
-   **Configuration:** Users can manage their own lists of accounts and categories to tailor the application to their needs.

**Vision**
The long-term vision is to create a comprehensive, AI-driven personal finance co-pilot that simplifies financial management, promotes financial literacy, and empowers users to make smarter financial decisions with minimal manual effort. Future development will focus on budgeting, goal setting, and predictive financial forecasting.

---

### 1.2 Target Audience and Stakeholders

| Role/Audience              | Description                                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Primary User**           | An individual seeking a modern, automated tool to manage and analyze their personal finances. They value data visualization and AI-driven insights over traditional manual spreadsheet methods.         |
| **Development Team**       | Software engineers responsible for maintaining, extending, and deploying the application. They require clear documentation on architecture, setup, and deployment.                                        |
| **Project Manager**        | Oversees the development lifecycle, roadmap, and feature prioritization. Uses this documentation to understand system capabilities and dependencies.                                                    |
| **Quality Assurance (QA)** | Testers who need to understand functional requirements, use cases, and system behavior to create effective test plans.                                                                                  |

---

### 1.3 Glossary: Definitions, Acronyms, and Abbreviations

| Term       | Definition                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| **AI**     | Artificial Intelligence. Refers to the use of the Google Gemini API for data analysis.                                        |
| **API**    | Application Programming Interface. In this context, the GraphQL API provided by the backend server.                           |
| **CRUD**   | Create, Read, Update, Delete. The four basic functions of persistent storage.                                                 |
| **GCP**    | Google Cloud Platform. The cloud provider for which a production deployment guide is provided.                                |
| **GraphQL**| A query language for APIs and a runtime for fulfilling those queries with your existing data.                                 |
| **Monorepo**| A software development strategy where code for many projects is stored in the same repository.                                |
| **PERN**   | PostgreSQL, Express, React, Node.js. The technology stack used for the application.                                           |
| **SWEBOK** | Software Engineering Body of Knowledge. A guide to the knowledge and practices that define the software engineering profession. |
| **UI/UX**  | User Interface / User Experience.                                                                                             |

---

### 1.4 References

| Document/Link                                   | Description                                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [Google Gemini API Docs](https://ai.google.dev/docs) | Official documentation for the AI service used for financial analysis.                                   |
| [React Docs](https://react.dev/)                | Official documentation for the React framework used in the frontend.                                     |
| [Apollo GraphQL Docs](https://www.apollographql.com/docs/) | Official documentation for Apollo Server (backend) and Apollo Client (frontend).                         |
| [PostgreSQL Docs](https://www.postgresql.org/docs/) | Official documentation for the PostgreSQL database system.                                               |
| [SWEBOK Guide V3.0](https://www.computer.org/education/bodies-of-knowledge/software-engineering) | The standard from which this documentation's structure is derived.                                       |
