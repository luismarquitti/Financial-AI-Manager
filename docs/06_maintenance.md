# 6. Software Maintenance

This section outlines the strategies for maintaining the Financial AI Manager in a production environment, covering monitoring, recovery, and release management.

---

### 6.1 Monitoring, Alerting, and Logging Strategy

#### Monitoring
> **[TODO]**: This section outlines the planned strategy. Implementation requires integration with a monitoring service like Google Cloud Monitoring (Cloud Logging/Metrics).

-   **Cloud Run Metrics:** The Cloud Run service will be monitored for key performance indicators (KPIs), including:
    -   Request Count & Latency (p50, p95, p99).
    -   Container CPU and Memory Utilization.
    -   Instance Count (for scaling analysis).
    -   HTTP 5xx Error Rate.
-   **Cloud SQL Metrics:** The PostgreSQL database instance will be monitored for:
    -   CPU and Memory Utilization.
    -   Storage Utilization.
    -   Active Connections.
    -   Read/Write IOPS.
-   **Gemini API:** API calls to the Gemini service will be monitored for error rates and response latency.

#### Alerting
Alerts will be configured to notify the development team of critical issues:
-   **High Error Rate:** An alert will be triggered if the 5xx error rate for the Cloud Run service exceeds a defined threshold (e.g., 1%) over a 5-minute period.
-   **High Latency:** An alert for p95 latency exceeding a threshold (e.g., 5 seconds).
-   **Resource Exhaustion:** Alerts for high CPU or memory utilization on either Cloud Run or Cloud SQL.

#### Logging
-   **Backend:** The Node.js application will log structured JSON messages to `stdout`. Cloud Run automatically collects these logs into **Google Cloud Logging**.
    -   **Levels:** Logs will be categorized by severity: `INFO`, `WARN`, `ERROR`, `DEBUG`.
    -   **Content:** Each log entry will include a timestamp, severity, message, and relevant context (e.g., transaction ID, user session ID if applicable). All unhandled exceptions will be logged as `ERROR`.
-   **Frontend:**
    > **[TODO]**: Implement a logging service (e.g., Sentry, LogRocket) to capture and aggregate client-side errors and performance data.

---

### 6.2 Backup and Recovery Procedures

-   **Database Backup:**
    -   **Service:** Cloud SQL for PostgreSQL provides fully managed automated backups.
    -   **Schedule:** Daily automated backups will be enabled.
    -   **Retention:** Backups will be retained for 7 days.
    -   **Point-in-Time Recovery (PITR):** PITR will be enabled, allowing restoration to any specific minute within the retention window.
-   **Database Recovery:**
    -   **Procedure:** In case of data loss or corruption, a database administrator can initiate a restore from a specific backup or a point-in-time recovery via the GCP Console or `gcloud` CLI.
    -   **RTO (Recovery Time Objective):** < 1 hour.
    -   **RPO (Recovery Point Objective):** < 24 hours (for full backup restore), or < 5 minutes (for PITR).
-   **Infrastructure:**
    -   The backend service on Cloud Run is stateless. Its configuration is managed via the `gcloud run deploy` command, which can be re-run to restore the service.
    -   The frontend is static and can be re-deployed from the CI/CD pipeline at any time.

---

### 6.3 Release Management and Rollback Strategy

#### Release Management
-   **Versioning:** The project will follow Semantic Versioning (SemVer - `MAJOR.MINOR.PATCH`).
-   **Process:**
    1.  Changes are merged into the `main` branch via pull requests.
    2.  Each merge triggers the CI/CD pipeline.
    3.  For a new release, a git tag (e.g., `v1.2.0`) is created on the `main` branch.
    4.  The CI/CD pipeline builds the Docker image, tags it with the version number (e.g., `backend:v1.2.0`), and deploys it to Cloud Run.
    5.  The frontend is built and deployed to Cloud Storage.

#### Rollback Strategy
-   **Backend (Cloud Run):**
    -   Cloud Run maintains a history of deployed revisions.
    -   **Procedure:** A rollback can be performed instantly via the GCP Console or `gcloud` CLI by splitting traffic back to a previous stable revision.
    -   **Time to Rollback:** < 1 minute.
-   **Frontend (Cloud Storage):**
    > **[TODO]**: Implement a more robust rollback strategy. A simple approach is to maintain versioned subdirectories in the storage bucket (e.g., `gs://bucket/v1.2.0/`) and update the load balancer to point to the desired version. A direct rollback involves re-running the CI/CD pipeline for a previous stable git tag.
-   **Database:**
    -   Database schema changes (migrations) are not easily rolled back.
    -   **Strategy:** Migrations must be written to be backward-compatible. This ensures that the previous version of the application code can still function with the newer schema, allowing the backend service to be rolled back without requiring an immediate database rollback.
