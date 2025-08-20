# 7. Software Configuration Management

This section details how the application's source code, build, and deployment processes are managed.

---

### 7.1 Version Control Strategy

-   **System:** Git.
-   **Repository:** The project is hosted in a single Git repository (monorepo).
-   **Branching Model:** The project follows a simplified Gitflow model:
    -   `main`: This branch represents the latest stable, production-ready code. Direct commits are prohibited. Changes are merged via pull requests.
    -   `feature/<feature-name>`: All new features or bug fixes are developed on feature branches, branched off from `main`.
    -   **Pull Requests (PRs):** Before a feature branch is merged into `main`, it must be reviewed by at least one other developer. Automated checks (linting, testing, building) in the CI pipeline must pass.

---

### 7.2 Build and Deployment Pipelines (CI/CD)

> **[TODO]**: This section outlines the planned CI/CD strategy. Implementation requires a CI/CD tool like GitHub Actions, GitLab CI, or Google Cloud Build.

A CI/CD pipeline will be configured to automate the testing and deployment process.

#### Continuous Integration (CI)
-   **Trigger:** On every push to any branch and on pull request creation.
-   **Steps:**
    1.  **Checkout Code:** Clones the repository.
    2.  **Install Dependencies:** Runs `yarn install`.
    3.  **Lint & Format Check:** Runs `yarn lint` and `yarn format --check`.
    4.  **Run Tests:** Runs `yarn test --coverage` to execute all unit tests.
    5.  **Build:** Runs `yarn build` to ensure both the client and server applications compile successfully.

#### Continuous Deployment (CD)
-   **Trigger:** On every successful merge to the `main` branch.
-   **Steps:**
    1.  **Run CI Steps:** All CI steps are executed first.
    2.  **Build & Push Docker Image (Backend):**
        -   Builds the Docker image for the server.
        -   Tags the image with the latest git commit SHA.
        -   Pushes the image to Google Artifact Registry.
    3.  **Deploy to Cloud Run (Backend):**
        -   Deploys the newly pushed image as a new revision on Cloud Run.
        -   Gradually shifts 100% of traffic to the new revision.
    4.  **Build & Deploy (Frontend):**
        -   Builds the static React application.
        -   Syncs the build output to the Google Cloud Storage bucket.

---

### 7.3 GCP Deployment Guide

This guide provides step-by-step instructions for deploying the full-stack "Financial AI Manager" application to Google Cloud Platform.

#### Prerequisites

-   A Google Cloud Platform (GCP) account with billing enabled.
-   The `gcloud` command-line tool installed and authenticated: `gcloud auth login`.
-   Docker installed locally.
-   Your GCP Project ID. Set it in your terminal:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```

#### Part 1: Database Setup (Cloud SQL)

1.  **Enable APIs**:
    ```bash
    gcloud services enable sqladmin.googleapis.com
    ```
2.  **Create a PostgreSQL Instance**:
    ```bash
    gcloud sql instances create financial-db --database-version=POSTGRES_14 --region=us-central1 --root-password="YOUR_STRONG_DB_PASSWORD"
    ```
3.  **Create a Database**:
    ```bash
    gcloud sql databases create financial_app --instance=financial-db
    ```
4.  **Get Connection Name**: You will need this for the backend.
    ```bash
    gcloud sql instances describe financial-db --format='value(connectionName)'
    ```

#### Part 2: Backend Deployment (Cloud Run)

1.  **Enable APIs**:
    ```bash
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
    ```
2.  **Store Secrets in Secret Manager**:
    a. **Database URL Secret**:
    ```bash
    # Replace with your details
    DB_URL="postgresql://postgres:YOUR_STRONG_DB_PASSWORD@/financial_app?host=/cloudsql/$(gcloud sql instances describe financial-db --format='value(connectionName)')"
    echo -n "$DB_URL" | gcloud secrets create DATABASE_URL --data-file=-
    ```
    b. **Gemini API Key Secret**:
    ```bash
    echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create API_KEY --data-file=-
    ```
3.  **Create an Artifact Registry Repository**:
    ```bash
    gcloud artifacts repositories create financial-app-repo --repository-format=docker --location=us-central1
    ```
4.  **Build and Push the Docker Image** (Run from project root):
    ```bash
    IMAGE_NAME="us-central1-docker.pkg.dev/$(gcloud config get-value project)/financial-app-repo/backend:latest"
    docker build -t $IMAGE_NAME -f packages/server/Dockerfile .
    gcloud auth configure-docker us-central1-docker.pkg.dev
    docker push $IMAGE_NAME
    ```
5.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy financial-api \
      --image=$IMAGE_NAME \
      --platform=managed \
      --region=us-central1 \
      --allow-unauthenticated \
      --add-cloudsql-instances=$(gcloud sql instances describe financial-db --format='value(connectionName)') \
      --update-secrets=DATABASE_URL=DATABASE_URL:latest,API_KEY=API_KEY:latest
    ```
    After deployment, copy the **Service URL**.

#### Part 3: Frontend Deployment (Cloud Storage)

1.  **Update API Endpoint**: Open `packages/client/src/apollo-client.ts` and change the `uri` to your Cloud Run **Service URL**.
    ```typescript
    // packages/client/src/apollo-client.ts
    const client = new ApolloClient({
      uri: 'YOUR_CLOUD_RUN_SERVICE_URL/graphql', // <-- UPDATE THIS
      cache: new InMemoryCache(),
    });
    ```
2.  **Build the React App**:
    ```bash
    yarn workspace client build
    ```
3.  **Create a Cloud Storage Bucket**:
    ```bash
    gsutil mb gs://your-unique-bucket-name
    ```
4.  **Upload Files**:
    ```bash
    gsutil -m rsync -r packages/client/dist gs://your-unique-bucket-name
    ```
5.  **Make the Bucket Public & Set Main Page**:
    ```bash
    gsutil iam ch allUsers:objectViewer gs://your-unique-bucket-name
    gsutil web set -m index.html -e index.html gs://your-unique-bucket-name
    ```
Your app is now accessible at `https://storage.googleapis.com/your-unique-bucket-name/index.html`.
