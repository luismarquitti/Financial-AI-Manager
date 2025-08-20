# Financial AI Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/financial-ai-manager/ci.yml?branch=main)
![Version](https://img.shields.io/badge/version-0.7.0-brightgreen)

An intelligent financial transaction analyzer powered by the Google Gemini API. This application allows users to connect to a database or upload their transaction data to receive a comprehensive summary, insightful charts, and an AI-powered analysis of their financial health.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact & Support](#contact--support)

## Features

-   **🤖 AI-Powered Analysis**: Leverages the Gemini API to generate an insightful summary of your financial health, including income/expense analysis and actionable advice.
-   **📊 Interactive Dashboard**: Visualize your finances with dynamic charts for monthly income vs. expenses and spending by category.
-   **🔄 Dual Data Sources**: Get started instantly by connecting to a pre-populated mock database or by uploading your own transaction files (`.csv`, `.xlsx`).
-   **✍️ Full CRUD Operations**: Enjoy complete control with the ability to Create, Read, Update, and Delete transactions, categories, and accounts directly within the application.
-   **🔍 Data Staging & Review**: A dedicated page to review, edit, and select transactions from an uploaded file before importing them, ensuring data accuracy.
-   **🔎 Advanced Filtering**: Easily filter and search through transactions by description, type (income/expense), category, and date range.
-   **⚙️ Settings Management**: Customize your financial tracking by adding, editing, or deleting personal spending categories and financial accounts.
-   **📱 Modern & Responsive UI**: A clean, intuitive interface built with React and Tailwind CSS that works seamlessly across devices.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
-   **Backend**: Node.js, Express, TypeScript
-   **API**: GraphQL with Apollo Server (Backend) & Apollo Client (Frontend)
-   **Database**: PostgreSQL
-   **AI Integration**: Google Gemini API (`@google/genai`)
-   **Development**: Monorepo with Yarn Workspaces, Docker

## Installation

Follow these steps to set up and run the project locally.

#### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [Yarn](https://yarnpkg.com/) (Classic or Berry)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/financial-ai-manager.git
    cd financial-ai-manager
    ```

2.  **Install dependencies:**
    This will install dependencies for all workspaces (client and server).
    ```bash
    yarn install
    ```

3.  **Configure Environment Variables:**
    Navigate to the server package and create a `.env` file.
    ```bash
    cd packages/server
    cp .env.example .env
    ```
    Now, open the new `.env` file and add your PostgreSQL database credentials and your Google Gemini API key.

4.  **Start the Database:**
    Make sure Docker Desktop is running. Then, from the project root, start the PostgreSQL container.
    ```bash
    docker-compose up -d
    ```

5.  **Seed the Database:**
    This command will create the necessary tables and populate them with initial sample data.
    ```bash
    yarn db:seed
    ```

6.  **Run the Application:**
    This will start both the backend server and the frontend development server concurrently.
    ```bash
    yarn dev
    ```
    The application should now be running at `http://localhost:5173`.

## Usage

Once the application is running, you can start using it in two ways:

1.  **Connect to Database:**
    -   On the welcome screen, click the "Connect & Fetch Transactions" button.
    -   This will load the pre-seeded data into the application.
    -   You will be redirected to the main dashboard, where you can see the AI summary, charts, and transaction data.

2.  **Import a File:**
    -   On the welcome screen, select the "Import File" tab.
    -   Click to upload or drag-and-drop a `.csv` or `.xlsx` file containing your transactions.
    -   You will be taken to the "Review & Import" page. Here you can edit, delete, or deselect transactions before saving.
    -   Click "Save Selected to Database" to import the data and view the dashboard.

From there, you can navigate between the **Dashboard**, **Transactions**, and **Settings** pages to manage and analyze your financial data.

## Contributing

Contributions are welcome! We follow a standard fork-and-pull-request workflow.

1.  **Open an Issue:** Before starting work on a new feature or bug fix, please open a GitHub issue to discuss the proposed changes.
2.  **Fork the Repository:** Create your own fork of the project.
3.  **Create a Branch:** Create a feature branch from the `main` branch (e.g., `feature/add-new-chart`).
4.  **Make Changes:** Implement your changes and ensure all tests pass.
5.  **Submit a Pull Request:** Push your branch to your fork and open a pull request back to the original repository's `main` branch. Please provide a clear description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact & Support

For support, questions, or to report a bug, please [open a GitHub issue](https://github.com/your-username/financial-ai-manager/issues).
