# Project Name

This is a README.md file for the project LP-BACK. It provides instructions on how to set up and run the project locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Migrations](#migrations)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Improvements](#improvements)

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- PostgreSQL instance
- Node.js and npm

## Installation

To install the project dependencies, run the following command:

```
npm install
```

## Configuration

Configure the environment variables by following these steps:

1. Rename the `.env.example` file to `.env`.
2. Open the `.env` file and update the values of the environment variables according to your configuration.

## Migrations

To execute the migrations and create the necessary database tables, run the following command:

```
npm run typeorm migration:run -- -d ./src/datasource.ts
```

## Running the Project

There are two options to run the project:

1. **Traditional API**: Run the project as a Nest.js API by executing the following command:

```
npm run start
```

2. **Serverless**: To run the project with Serverless, ensure that you have Serverless installed globally. If not, you can install it by running the command:

```
npm install -g serverless
```

Once Serverless is installed, run the project with the following command:

```
sls offline
```

Please note that the URLs may differ depending on the chosen method of execution.

## Environment Variables

The following environment variable is required:

- `ENVIRONMENT`: defines the environment. Use `local`to enable cors.
- `DB_HOST`: database server host
- `DB_PORT`: database server port
- `DB_USERNAME`: database server username
- `DB_PASSWORD`: database server password
- `DB_NAME`: database name
- `RANDOM_ORG_API_KEY`: api key for Random.org API. (Working key provided in .env.example)
- `USER_INITIAL_BALANCE`: defines the initial balance for new users
- `ENCRYPTION_KEY`: key used to encrypt/decrypt data (Used for JWT password encryption)
- `JWT_PRIVATE_KEY`: Private key used to generate jwt. It must be a private key using RSA256 and encoded in base64
- `JWT_PUBLIC_KEY`: Public key used to read jwt. It must be a private key using RSA256 and encoded in base64

## Improvements

- Include Swagger documentation. (Postman collection is included)
- Return DTOs instead of entities in all responses to adhere to best practices.
