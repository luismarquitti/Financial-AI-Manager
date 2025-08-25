
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client/react';
import client from './apollo-client';
import './i18n'; // Initialize i18next

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="flex justify-center items-center w-full h-screen bg-background text-text-primary">Loading...</div>}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Suspense>
  </React.StrictMode>
);
