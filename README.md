# Financial AI Manager

![Financial AI Manager Screenshot](https://storage.googleapis.com/fpl-prd-dm-generative-ai-testing/project-showcase/financial-ai-manager-screenshot.png)

An intelligent financial transaction analyzer powered by the Google Gemini API. This application allows users to connect to a simulated in-memory database or upload their CSV/XLSX transaction data to receive a comprehensive summary, insightful charts, and an AI-powered analysis of their financial health.

## ✨ Key Features

- **Dual Data Sources**: Connect to a pre-populated mock database (in-memory) or upload your own transaction files (`.csv`, `.xlsx`).
- **AI-Powered Analysis**: Leverages the Gemini API to generate an insightful summary of your financial health, including income/expense analysis and actionable advice.
- **Interactive Dashboard**: Visualize your finances with dynamic charts for monthly income vs. expenses and spending by category.
- **Full CRUD Operations**: Create, Read, Update, and Delete transactions, categories, and accounts directly within the application.
- **Data Staging & Review**: A dedicated page to review, edit, and select transactions from an uploaded file before importing them.
- **Advanced Filtering**: Easily filter and search through transactions by description, type (income/expense), category, and date range.
- **Settings Management**: Customize your financial tracking by adding, editing, or deleting personal spending categories and financial accounts.
- **Modern & Responsive UI**: Clean, intuitive interface built with React and Tailwind CSS that works seamlessly across devices.

## 🚀 How It Works

The application flow is designed to be simple and intuitive.

1.  **Choose a Data Source**: On the home screen, you can either:
    *   **Connect to Database**: Loads a set of mock financial data into the application's memory, enabling full CRUD functionality immediately.
    *   **Import File**: Upload a `.csv` or `.xlsx` file containing your transaction history.

2.  **Review & Import (File Upload)**:
    *   After uploading a file, you are taken to the **Import Page**.
    *   Here, you can review all parsed transactions. You can deselect any you don't want to import.
    *   You can also **edit** individual transactions to correct data or **add new ones** manually before the final import.
    *   Click "Save Selected to Database" to finalize the import and load the data into the app.

3.  **Explore the Dashboard**:
    *   The main dashboard provides a high-level overview of your finances for the selected account.
    *   View summary cards for total income, expenses, and net savings.
    *   Read the **AI Financial Analyst** section, where Gemini provides a concise summary and actionable insights based on your current data.
    *   Interact with the bar and pie charts to understand your financial trends visually.

4.  **Manage Transactions**:
    *   Navigate to the **Transactions** page to see a detailed, paginated list of all your transactions.
    *   Use the powerful filter and search controls to find specific entries.
    *   Add, edit, or delete transactions as needed.

5.  **Configure Settings**:
    *   Go to the **Settings** page to manage the lists of available `Categories` and `Accounts`. This ensures your transaction data is always well-organized.

## 🛠️ Technology Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Integration**: [Google Gemini API (`@google/genai`)](https://github.com/google/generative-ai-js)
-   **Charting**: [Recharts](https://recharts.org/)
-   **Data Simulation**: [Apollo Client](https://www.apollographql.com/docs/react/) is used to simulate a GraphQL API for an in-memory "database". All data is reset on page refresh.
-   **File Parsing**: [SheetJS (xlsx)](https://sheetjs.com/)

---

## 🌟 Next Steps

This application provides a strong foundation for a personal finance tool. Here are some suggestions for future enhancements to improve the overall experience:

### 1. AI-Powered Transaction Categorization
- **Challenge**: Manually categorizing dozens of imported transactions is time-consuming and error-prone.
- **Proposed Solution**: Enhance the **Import Page** with an "AI-Categorize" feature. This would use the Gemini API to analyze the description of each new transaction and suggest the most appropriate category based on the user's existing categories and transaction history.
- **Implementation Idea**:
    - Add a button like "Suggest Categories with AI" on the import screen.
    - When clicked, send the new transactions (description, amount) and the list of available categories to Gemini.
    - The prompt would ask the model to return a suggested category for each transaction.
    - The UI would then pre-fill the category dropdown for each transaction, perhaps with a small icon indicating it's an AI suggestion. The user can then quickly review and confirm.

### 2. Data Persistence
- **Challenge**: The current application is a demo and uses an in-memory database, meaning all changes are lost upon refreshing the page.
- **Proposed Solution**: Integrate browser-based storage like **`localStorage`** or **`IndexedDB`**. This would allow users' transactions, accounts, and categories to be saved between sessions, creating a much more useful and persistent experience.

### 3. Budgeting and Goals
- **Challenge**: Users can see where their money went, but they can't proactively manage their spending.
- **Proposed Solution**: Introduce a "Budgets" feature. Users could set monthly spending limits for specific categories (e.g., "$300/month for Groceries"). The dashboard could then display progress bars or gauges showing how much of the budget has been spent, providing clear visual feedback to help users stay on track.

### 4. Advanced Visualizations & Reporting
- **Challenge**: The current charts provide a good overview, but more in-depth analysis is limited.
- **Proposed Solution**: Add more advanced reporting features:
    - A **Cash Flow Trend** line chart to visualize net savings over time.
    - A **Date Range Filter** directly on the dashboard to analyze specific periods (e.g., last quarter, year-to-date).
    - An option to **Export** reports to PDF or CSV.
