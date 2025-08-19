# Deployment Guide: Google Cloud Platform (GCP)

This guide provides step-by-step instructions for deploying the full-stack "Financial AI Manager" application to Google Cloud Platform. The deployment consists of three main parts: a managed PostgreSQL database, a containerized backend service, and a static frontend.

### Prerequisites

-   A Google Cloud Platform (GCP) account with billing enabled.
-   The `gcloud` command-line tool installed and authenticated: `gcloud auth login`.
-   Docker installed locally.
-   Your GCP Project ID. Set it in your terminal:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```

---

## Part 1: Database Setup (Cloud SQL)

We will use Cloud SQL to host a managed, production-ready PostgreSQL database.

1.  **Enable APIs**: Enable the Cloud SQL Admin API.
    ```bash
    gcloud services enable sqladmin.googleapis.com
    ```

2.  **Create a PostgreSQL Instance**:
    This command creates a new PostgreSQL instance. Choose a strong password.
    ```bash
    gcloud sql instances create financial-db --database-version=POSTGRES_14 --region=us-central1 --root-password="YOUR_STRONG_DB_PASSWORD"
    ```

3.  **Create a Database**:
    Inside the instance, create the specific database for the application.
    ```bash
    gcloud sql databases create financial_app --instance=financial-db
    ```

4.  **Get Connection Name**:
    Find the **Connection Name** for your instance. You will need this for the backend. You can find it in the GCP Console under SQL > your instance > Overview, or by running:
    ```bash
    gcloud sql instances describe financial-db --format='value(connectionName)'
    ```
    It will look like `your-project-id:us-central1:financial-db`.

---

## Part 2: Backend Deployment (Cloud Run)

We will containerize the Node.js server and deploy it as a serverless service on Cloud Run.

1.  **Enable APIs**:
    ```bash
    gcloud services enable run.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    ```

2.  **Store Secrets in Secret Manager**:
    It's critical to store sensitive data like database credentials and API keys securely.

    a. **Create Database URL Secret**:
    The URL format for Cloud SQL is `postgresql://<user>:<password>@/<dbname>?host=/cloudsql/<connection_name>`.
    ```bash
    # Replace with your details
    DB_URL="postgresql://postgres:YOUR_STRONG_DB_PASSWORD@/financial_app?host=/cloudsql/your-project-id:us-central1:financial-db"

    echo -n "$DB_URL" | gcloud secrets create DATABASE_URL --data-file=-
    ```

    b. **Create Gemini API Key Secret**:
    ```bash
    echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create API_KEY --data-file=-
    ```

3.  **Create an Artifact Registry Repository**:
    This is where we'll store our Docker image.
    ```bash
    gcloud artifacts repositories create financial-app-repo --repository-format=docker --location=us-central1
    ```

4.  **Build and Push the Docker Image**:
    A `Dockerfile` is included in `packages/server`. Run these commands from the **root** of the project.
    ```bash
    # Define image name
    IMAGE_NAME="us-central1-docker.pkg.dev/YOUR_PROJECT_ID/financial-app-repo/backend:latest"

    # Build the image
    docker build -t $IMAGE_NAME -f packages/server/Dockerfile .

    # Configure Docker to authenticate with Artifact Registry
    gcloud auth configure-docker us-central1-docker.pkg.dev

    # Push the image
    docker push $IMAGE_NAME
    ```

5.  **Deploy to Cloud Run**:
    This command deploys the container and connects it to the database and secrets.
    ```bash
    gcloud run deploy financial-api \
      --image=$IMAGE_NAME \
      --platform=managed \
      --region=us-central1 \
      --allow-unauthenticated \
      --add-cloudsql-instances=your-project-id:us-central1:financial-db \
      --update-secrets=DATABASE_URL=DATABASE_URL:latest,API_KEY=API_KEY:latest
    ```
    - `--allow-unauthenticated` makes the API public. For production, you would set up authentication.
    - After deployment, you will get a **Service URL**. Copy this URL.

6.  **Run Database Migrations/Seed**:
    Unfortunately, Cloud Run doesn't have a simple "run once" command for seeding. The easiest way for a first-time setup is to temporarily configure your local machine to connect to the Cloud SQL database using the [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/postgres/connect-auth-proxy) and run `yarn db:seed` locally.

---

## Part 3: Frontend Deployment (Cloud Storage)

We will host the static React frontend on Cloud Storage.

1.  **Update API Endpoint**:
    Before building, you must update the API endpoint in the client. Open `packages/client/src/apollo-client.ts` and change the `uri` to your Cloud Run **Service URL**.
    ```typescript
    // packages/client/src/apollo-client.ts
    const client = new ApolloClient({
      uri: 'YOUR_CLOUD_RUN_SERVICE_URL/graphql', // <-- UPDATE THIS
      cache: new InMemoryCache(),
    });
    ```

2.  **Build the React App**:
    From the project root:
    ```bash
    yarn workspace client build
    ```
    The output will be in `packages/client/dist`.

3.  **Create a Cloud Storage Bucket**:
    Bucket names must be globally unique.
    ```bash
    gsutil mb gs://your-unique-bucket-name
    ```

4.  **Upload Files**:
    ```bash
    gsutil -m rsync -r packages/client/dist gs://your-unique-bucket-name
    ```

5.  **Make the Bucket Public**:
    ```bash
    gsutil iam ch allUsers:objectViewer gs://your-unique-bucket-name
    ```

6.  **Set the Main Page**:
    ```bash
    gsutil web set -m index.html -e index.html gs://your-unique-bucket-name
    ```

Your application is now live! You can access it via `https://storage.googleapis.com/your-unique-bucket-name/index.html`. For a production setup, you would add a **Cloud Load Balancer** in front of the bucket to provide a custom domain and HTTPS.

---

## Part 4: Cost Estimation & Free Tier

Deploying this application can be very cost-effective and potentially free for low-traffic personal use, thanks to GCP's "Always Free" tier. Below is a summary of the costs associated with the services used.

> **Note**: Prices are based on the `us-central1` region and are subject to change.

| Service             | Free Tier Limit (per month)                                                                                                    | Pricing Model (Beyond Free Tier)                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **Cloud SQL**       | 1 `db-f1-micro` instance, 20 GB SSD storage, 20 GB automated backups. (Not available for Postgres, only MySQL/SQL Server)        | Billed per vCPU-hour, GiB-hour of RAM, GiB-month of storage, and network egress.               |
| **Cloud Run**       | 2 million requests, 360,000 vCPU-seconds, 180,000 GiB-seconds of memory, 1 GiB network egress within North America.               | Billed per vCPU-second, GiB-second of memory, request count, and network egress.              |
| **Artifact Registry** | 0.5 GB of storage.                                                                                                             | Billed per GiB-month of storage and network egress.                                           |
| **Secret Manager**  | 6 secret versions, 10,000 access operations.                                                                                   | Billed per active secret version and per 10,000 access operations.                            |
| **Cloud Storage**   | 5 GB-month of Standard Storage, 5,000 Class A operations, 50,000 Class B operations, 1 GB network egress from North America.      | Billed per GiB-month of storage, per 10,000 operations, and per GiB of network egress.        |
| **Gemini API**      | Varies by model. `gemini-2.5-flash` offers a free tier for a limited number of requests per minute.                             | Billed per 1,000 characters or per image, depending on the input.                           |

### Example Cost Scenario (Low Traffic)

For a personal project with light usage that stays within the monthly free tier limits for Cloud Run, Artifact Registry, Secret Manager, Cloud Storage, and the Gemini API, **your primary cost will be the Cloud SQL instance**.

-   A small Cloud SQL instance (e.g., `db-g1-small` with 1 vCPU, 1.7 GB RAM) running 24/7 could cost approximately **$25-35 per month**.
-   **To minimize costs**, you can stop your Cloud SQL instance when you are not actively using the application.

For a precise estimate based on your expected usage, use the official [**Google Cloud Pricing Calculator**](https://cloud.google.com/products/calculator).