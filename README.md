![GitHub Release](https://img.shields.io/github/v/release/JensAstrup/shortcut-assistant-backend?style=for-the-badge)
[![Codecov](https://img.shields.io/codecov/c/github/JensAstrup/shortcut-assistant-backend?style=for-the-badge&link=https%3A%2F%2Fapp.codecov.io%2Fgh%2FJensAstrup%2Fshortcut-assistant-backend)](https://app.codecov.io/gh/JensAstrup/shortcut-assistant-backend)

[![Status Page](https://img.shields.io/website?style=for-the-badge&url=https%3A%2F%2Fstatus.jensastrup.io%2F&label=Status%20Page)](https://status.jensastrup.io/)
![](https://api.checklyhq.com/v1/badges/checks/e8b42215-cec2-4553-9318-dc7ec168005a?style=for-the-badge&theme=dark&responseTime=true)

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/kmdlofehocppnlkpokdbiaalcelhedef?style=for-the-badge&)](https://chromewebstore.google.com/detail/shortcut-assistant/kmdlofehocppnlkpokdbiaalcelhedef?hl=en&authuser=0)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/kmdlofehocppnlkpokdbiaalcelhedef?style=for-the-badge&)](https://chromewebstore.google.com/detail/shortcut-assistant/kmdlofehocppnlkpokdbiaalcelhedef?hl=en&authuser=0)


# Shortcut Assistant Backend

The backend service powering the AI features of the [Shortcut Assistant browser extension](https://github.com/JensAstrup/shortcut-assistant).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Deploying](#deploying)

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Getting Started

### Installation

1. **Install dependencies:**
    ```sh
    yarn install
    ```

### Running the Application

1. **Start the application with Docker Compose:**
    ```sh
    docker-compose up
    ```

   This will start two services:
   - `app`: The Node.js application running on port `3000` (or whichever port is specified by `PORT` in the environment variables)
   - `db`: A PostgreSQL database running on port `5432` (or whichever port is specified by `DB_PORT` in the environment variables)


## Scripts

- **Start the production server:**
  ```sh
  yarn start
  ```

- **Build the project:**
  ```sh
  yarn build
  ```

- **Run the development server:**
  ```sh
  yarn start:dev
  ```

- **Lint the codebase:**
  ```sh
  yarn lint
  ```

- **Run tests:**
  ```sh
  yarn test
  ```

- **Run tests with coverage:**
  ```sh
  yarn test:coverage
  ```
  
- **Copy Migrations to dist folder:**
  ```sh
  yarn build:copy-migrations
  ```

- **Replace `@sb/` paths in compiled files with absolute paths:**
  ```sh
  yarn replace-paths
  ```

## Environment Variables

The following environment variables are used in the application:

- OPENAI_API_KEY: An OpenAI API key.
- SENTRY_DSN: A Sentry DSN for error tracking.
- DD_API_KEY: A Datadog API key for logging.
- NODE_ENV: The environment in which the application is running (e.g., development, production).
- DB_NAME: The name of the PostgreSQL database.
- DB_USERNAME: The username for the PostgreSQL database.
- DB_PASSWORD: The password for the PostgreSQL database.
- DB_HOSTNAME: The hostname for the PostgreSQL database (set to db for Docker).
- DB_PORT: The port on which the PostgreSQL database is running.


## Deploying

On merge to `develop`, the application is automatically deployed to the staging environment on DigitalOcean. 
On merge to `main`, the application is automatically deployed to the production environment. 

The database and environment variables are managed using DigitalOcean Managed Databases and App Platform.
