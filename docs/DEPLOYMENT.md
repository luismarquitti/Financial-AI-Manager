# Deployment Guide: Firebase Hosting

This guide provides comprehensive instructions for deploying the web application to Firebase Hosting.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm/yarn:** [https://nodejs.org/](https://nodejs.org/)
*   **Firebase CLI:** Install or update the Firebase command-line tools:
    ```bash
    npm install -g firebase-tools
    ```

## Firebase Project Setup

1.  **Login to Firebase:**
    ```bash
    firebase login
    ```
    This will open a browser window for you to authenticate with your Google account.

2.  **Select or Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project if you don't have one already.
    *   Once your project is ready, find the **Project ID**. You can see it in the URL (e.g., `https://console.firebase.google.com/project/<your-project-id>/...`) or in the Project settings.

3.  **Link Your Local Project:**
    Use the `firebase use` command to associate your local repository with your Firebase project. Replace `<project-id>` with your actual Firebase Project ID.
    ```bash
    firebase use <project-id>
    ```
    This command updates the `.firebaserc` file with your project alias.

## Local Setup & Configuration Files

This project is pre-configured for a seamless deployment experience. Here’s a breakdown of the key files:

*   **`.firebaserc`:** This file tells the Firebase CLI which project to use. The `firebase use` command automatically populates it.
*   **`firebase.json`:** This is the core configuration file for Firebase services. For this project, it's configured for **Hosting**.

### Explanation of `firebase.json`

```json
{
  "hosting": {
    "public": "packages/client/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "predeploy": [
      "yarn build"
    ]
  }
}
```

*   **`"public": "packages/client/dist"`**: This is the most critical setting. It tells Firebase that the static assets of your application (the output of the build process) are located in the `packages/client/dist` directory.
*   **`"rewrites": [...]`**: This section configures the application as a Single Page Application (SPA). It ensures that any URL requested by a user is redirected to `index.html`, allowing the client-side router (e.g., React Router) to handle the page navigation.
*   **`"predeploy": ["yarn build"]`**: This is a powerful hook that runs a script *before* any deployment. It automatically executes the `yarn build` command, ensuring that you are always deploying the latest version of your application without having to remember to build it manually.

## Deployment Steps

A `deploy` script has been added to `package.json` to simplify the process.

1.  **Install Dependencies:**
    ```bash
    yarn install
    ```

2.  **Deploy the Application:**
    ```bash
    npm run deploy
    ```
    This command will first run the `yarn build` script and then deploy the contents of the `packages/client/dist` directory to Firebase Hosting.

    Alternatively, you can run the Firebase command directly:
    ```bash
    firebase deploy --only hosting
    ```

After the command finishes, it will output the URL where your application is live.

## Troubleshooting Tips

*   **`Error: Firebase project not found`**:
    *   Ensure you have run `firebase use <project-id>`.
    *   Check that the project ID in `.firebaserc` is correct.
    *   Make sure you are logged into the correct Google account (`firebase login`).

*   **`404 Not Found` errors after deployment (especially on page refresh)**:
    *   Verify that the `rewrites` configuration is present in `firebase.json`. This is the most common cause for SPA routing issues.

*   **Old version of the site is live**:
    *   This usually happens if the `predeploy` script fails or is forgotten. The `npm run deploy` script prevents this.
    *   Clear your browser cache or check the site in an incognito window.

*   **Permission Denied Errors**:
    *   Ensure the account you logged in with (`firebase login`) has the necessary permissions (e.g., Editor, Owner) for the Firebase project.
