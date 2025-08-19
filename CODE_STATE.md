## Application State: v0.1 (Pre-Fullstack)

This document describes the state of the "Financial AI Manager" application before the transition to a full-stack architecture.

### Architecture

- **Client-Side Only**: The application is a pure single-page application (SPA) running entirely in the browser. There is no backend server.
- **Framework**: Built with React and TypeScript.
- **Dependencies**: Uses ES Modules loaded via an `importmap` in `index.html` from `esm.sh`. Key dependencies include `react`, `recharts`, and `@google/genai`.

### Data Handling

- **In-Memory Mock Database**: All data operations (CRUD for transactions, categories, accounts) are simulated.
- **`apiService.ts`**: This service acts as a fake API layer. It maintains an in-memory array of transactions, categories, and accounts.
- **Initial Data Loading**: On the first data fetch, the `apiService` asynchronously loads a static `data/transactions.json` file to populate the mock database.
- **State Management**: The primary application state is managed within the root `App.tsx` component using React's `useState`, `useMemo`, and `useCallback` hooks.
- **No Persistence**: All data, including any user additions or modifications, is lost when the browser is refreshed.

### AI Integration

- **Direct API Calls**: The frontend makes direct calls to the Google Gemini API from the `services/geminiService.ts`.
- **API Key**: The Gemini API key is expected to be available as an environment variable (`process.env.API_KEY`) directly in the client-side code, which is insecure and not suitable for production.

### Structure

The project is organized in a flat structure with the following key areas:
- `components/`: Reusable React components (Dashboard, Tables, Modals, etc.).
- `pages/`: Top-level components representing application pages (Transactions, Import, Settings).
- `services/`: Modules responsible for external communication (`apiService.ts`, `geminiService.ts`).
- `utils/`: Helper functions for data parsing and analysis.
- `App.tsx`: The main component that manages state and routing.
- `index.html`: The entry point that sets up the environment and loads the app.