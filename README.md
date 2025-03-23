# Express-Api

![Node.js](https://img.shields.io/badge/Node.js-v16.0.0-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.17.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v5.0.0-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

This is a web API built using **MongoDB** and **Express.js**. It provides a comprehensive movies database and allows users to perform various operations such as retrieving movies, logging in, and managing their accounts. The API is designed with security in mind, ensuring safe and reliable interactions.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Movies](#movies)
  - [Authentication](#authentication)
  - [Users](#users)
- [Security Features](#security-features)
- [Development Scripts](#development-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Movies Management**:
  - Retrieve a list of movies.
  - Search movies using query strings.
  - Add, update, or delete movies (admin only).
  - Get movies by genre or highest-rated movies.
  - View movie statistics.

- **User Authentication**:
  - Secure user signup and login.
  - Password reset functionality via email.
  - JWT-based authentication and authorization.

- **User Management**:
  - Update user details (name, email).
  - Change passwords securely.
  - Deactivate user accounts.

- **Security**:
  - Protection against NoSQL injection, XSS, and parameter pollution.
  - Rate limiting to prevent brute force attacks.
  - Helmet for setting secure HTTP headers.

---

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Nodemailer

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```bash
   cd Express-Api
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   PORT=<your-port>
   CONN_STR=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   LOGIN_EXPIRES=<jwt-expiration-time>
   EMAIL_HOST=<your-email-host>
   EMAIL_PORT=<your-email-port>
   EMAIL_USER=<your-email-username>
   EMAIL_PASSWORD=<your-email-password>
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

---

## API Endpoints

### Movies

- `GET /api/v1/movies`: Retrieve all movies.
- `GET /api/v1/movies/highest-rated`: Get the top 5 highest-rated movies.
- `GET /api/v1/movies/movie-stats`: Get movie statistics.
- `GET /api/v1/movies/movie-by-genre/:genre`: Get movies by genre.
- `POST /api/v1/movies`: Add a new movie (admin only).
- `PATCH /api/v1/movies/:id`: Update a movie by ID (admin only).
- `DELETE /api/v1/movies/:id`: Delete a movie by ID (admin only).

### Authentication

- `POST /api/v1/auth/signup`: Sign up a new user.
- `POST /api/v1/auth/login`: Log in an existing user.
- `POST /api/v1/auth/forgotPassword`: Request a password reset link.
- `PATCH /api/v1/auth/resetPassword/:token`: Reset the password using a token.

### Users

- `GET /api/v1/users/getAllUsers`: Retrieve all users (admin only).
- `PATCH /api/v1/users/updatePassword`: Update the logged-in user's password.
- `PATCH /api/v1/users/updateMe`: Update the logged-in user's details.
- `DELETE /api/v1/users/deleteMe`: Deactivate the logged-in user's account.

---

## Security Features

- **Helmet**: Adds secure HTTP headers.
- **Rate Limiting**: Limits the number of requests from a single IP.
- **Data Sanitization**: Prevents NoSQL injection and XSS attacks.
- **HPP**: Prevents HTTP parameter pollution.

---

## Development Scripts

- **Delete all movies**:
  ```bash
  node data/import-dev-data.js --delete
  ```

- **Import movies from `movies.json`**:
  ```bash
  node data/import-dev-data.js --import
  ```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.