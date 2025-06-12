# Pump My Bike Server (Node.js Backend) ⚙️
## Overview

This is the backend server for the Pump My Bike iOS application, developed using Node.js and Express. It provides a robust RESTful API to manage bike pump data, user authentication, and review submissions, connecting to a PostgreSQL database for persistent storage.
Features

* **RESTful API:** Provides well-defined API endpoints for managing pump information, user data, and reviews.
* **User Authentication:** Secure user registration and login functionality (e.g., JWT-based authentication).
* **Pump Data Management:** CRUD operations for bike pump locations and details.
* **Review System:** Allows users to submit and retrieve ratings and comments for pumps.
* **PostgreSQL Database:** Utilizes PostgreSQL as the primary data store for all application data.
* **Scalable Architecture:** Designed with clear separation of concerns for maintainability and future scaling.

## Technologies Used
* **Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** PostgreSQL
* **ORM/Database Client:** Sequelize
* **Authentication:** SuperTokens
* **Environment Variables:** dotenv (for secure configuration)

## Setup & Installation

To get the Pump My Bike Server running on your local machine, follow these steps:

1. Clone the Repository:
```
git clone https://github.com/MilosDenck/Pump-My-Bike-Server.git # Replace with your actual repo link
cd Pump-My-Bike-Server
```
## Quick Setup with Docker Compose

This project can be easily set up for local development using Docker Compose.

### Prerequisites

* Docker Desktop (or Docker Engine) installed and running.

### Steps

1.  **Clone the Repository:**
    ```bash
    cd Pump-My-Bike-Server
    ```

2.  **Environment Configuration:**
    * Create `backend.env`, `db-backend.env` and `db-supertokens.env` file in the root directory if you haven't already. This file is used by Docker Compose to set environment variables for your services.
    `backend.env:`
    ```
    DB_HOST=postgres
    DB_PORT=5432
    DB_USER=db_user
    DB_PASSWORD=db_password
    DB_NAME=database_name
    EMAIL_HOST=mail.server
    EMAIL_ADDRESS=email@address.com
    EMAIL_PASSWORD=email_password
    BASE_URL=base-url.com
    FRONTEND_BASE=frontend-url.com
    SUPERTOKEN_API=http://supertokens:3567
    ```
    `db-backend.env:`
    ```
    POSTGRES_USER=db_user
    POSTGRES_PASSWORD=db_password
    POSTGRES_DB=db_name
    ``` 
    `db-supertokens.env:`
    ```
    POSTGRES_USER=db_user
    POSTGRES_PASSWORD=db_password
    POSTGRES_DB=db_name
    ```
    `supertokens.env:`
    ```
    POSTGRESQL_CONNECTION_URI=postgresql://supertokens_user:somePassword@supertokens-db:5432/supertokens
    ```
3.  **Start Services:**
    ```bash
    docker-compose up -d 
    ```
    This command will build (if necessary), create, and start all services defined in your `docker-compose.yml` (e.g., your Node.js app and PostgreSQL database).

The backend server should now be running and accessible, typically on `http://localhost:8000` (or your configured port).

---

## API Endpoints

| Method | Endpoint             | Description                            | Authentication |
| :----- | :------------------- | :------------------------------------- | :------------- |
| `POST` | `/auth/signup`       | Register a new user                    | No             |
| `POST` | `/auth/signin`      | Login User                             | No             |
| `GET`  | `/locations`      | get Pumps in your location                | No             |

## Related Project

[Pump My Bike (ios App)](https://github.com/MilosDenck/Pump-my-Bike)
*The companion iOS application that consumes this backend API.

## Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

## License

All code is the property of Milos Denck. Feel free to be inspired by my code.
