# 9. Software Engineering Process

This section describes the methodology and tools used to manage the software development lifecycle for the Financial AI Manager.

---

### 9.1 Development Methodology

-   **Methodology:** Agile (Scrum-like)
-   **Description:** The team follows an Agile development approach to facilitate iterative development, flexibility, and continuous feedback. While not strictly adhering to all Scrum ceremonies, the core principles are adopted.
-   **Sprints:**
    > **[TODO]**: Define sprint length and ceremonies.
    -   Work is organized into time-boxed sprints (e.g., two weeks).
    -   A planning meeting is held at the beginning of each sprint to prioritize tasks from the backlog.
    -   Daily stand-ups are conducted to sync progress and identify blockers.
    -   A review/demo is held at the end of the sprint to showcase completed work.

-   **Backlog Management:**
    -   A product backlog is maintained, containing all user stories, features, bug fixes, and technical tasks.
    -   The backlog is continuously prioritized by the project manager/product owner to ensure the team is always working on the most valuable items.

---

### 9.2 Workflow and Collaboration Tools

| Tool                               | Purpose                                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Version Control**                | **Git / GitHub (or similar)**: Used for source code management, branching, and pull requests for code reviews.                                        |
| **Project Management**             | **Jira / Trello / GitHub Projects (or similar)**: Used for managing the product backlog, planning sprints, and tracking the status of tasks.             |
| **CI/CD**                          | **GitHub Actions / GitLab CI / Google Cloud Build (or similar)**: Automates the build, test, and deployment pipelines.                                |
| **Communication**                  | **Slack / Microsoft Teams (or similar)**: Used for daily team communication, announcements, and automated notifications from the CI/CD pipeline.        |
| **Documentation**                  | **This Wiki (Markdown files in Git repository)**: Serves as the single source of truth for all technical documentation.                               |
| **Design**                         | **Figma / Sketch (or similar)**: > **[TODO]**: To be used for creating and sharing UI mockups and design prototypes.                                  |
