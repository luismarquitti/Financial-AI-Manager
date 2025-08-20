# 12. Software Engineering Economics

This section addresses the economic aspects of the Financial AI Manager project, including cost considerations and resource allocation.

---

### 12.1 Cost Estimation & Analysis (GCP)

Deploying this application can be very cost-effective and potentially free for low-traffic personal use, thanks to GCP's "Always Free" tier. Below is a summary of the costs associated with the services used.

> **Note**: Prices are based on the `us-central1` region and are subject to change. For a precise estimate based on your expected usage, use the official [**Google Cloud Pricing Calculator**](https://cloud.google.com/products/calculator).

| Service             | Free Tier Limit (per month)                                                                                                    | Pricing Model (Beyond Free Tier)                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **Cloud SQL**       | 1 `db-f1-micro` instance, 20 GB SSD storage, 20 GB automated backups. (Not available for Postgres, only MySQL/SQL Server)        | Billed per vCPU-hour, GiB-hour of RAM, GiB-month of storage, and network egress.               |
| **Cloud Run**       | 2 million requests, 360,000 vCPU-seconds, 180,000 GiB-seconds of memory, 1 GiB network egress within North America.               | Billed per vCPU-second, GiB-second of memory, request count, and network egress.              |
| **Artifact Registry** | 0.5 GB of storage.                                                                                                             | Billed per GiB-month of storage and network egress.                                           |
| **Secret Manager**  | 6 secret versions, 10,000 access operations.                                                                                   | Billed per active secret version and per 10,000 access operations.                            |
| **Cloud Storage**   | 5 GB-month of Standard Storage, 5,000 Class A operations, 50,000 Class B operations, 1 GB network egress from North America.      | Billed per GiB-month of storage, per 10,000 operations, and per GiB of network egress.        |
| **Gemini API**      | Varies by model. `gemini-2.5-flash` offers a free tier for a limited number of requests per minute.                             | Billed per 1,000 characters or per image, depending on the input.                           |

#### Example Cost Scenario (Low Traffic)

For a personal project with light usage that stays within the monthly free tier limits for Cloud Run, Artifact Registry, Secret Manager, Cloud Storage, and the Gemini API, **your primary cost will be the Cloud SQL instance**.

-   A small Cloud SQL instance (e.g., `db-g1-small` with 1 vCPU, 1.7 GB RAM) running 24/7 could cost approximately **$25-35 per month**.
-   **To minimize costs**, you can stop your Cloud SQL instance when you are not actively using the application.

---

### 12.2 Resource Allocation

> **[TODO]**: This section should be filled out by the Project Manager.
-   **Development Team:**
    -   1 Project Manager (Part-time)
    -   1 Tech Lead (Full-time)
    -   2 Software Engineers (Full-time)
-   **Timeline:**
    -   Initial MVP: 3 months
    -   Post-MVP enhancements: Ongoing

---

### 12.3 Licensing

All third-party libraries and frameworks used in this project are open-source and licensed under permissive licenses (e.g., MIT, Apache 2.0). A full list of dependencies and their licenses can be found in the `yarn.lock` file and the `package.json` files within each workspace.
