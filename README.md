# Express-Api

![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express.js](https://img.shields.io/badge/Express.js-4.21-blue)
![Mongoose](https://img.shields.io/badge/Mongoose-8-brightgreen)
![React](https://img.shields.io/badge/React-19-61dafb)
![License](https://img.shields.io/badge/License-MIT-yellow)

A movies REST API built with **Express.js** and **MongoDB**, with a **React** frontend called Cineflix. Users can sign up, log in and browse movies; admins can add, edit and delete movies and list users. The whole stack runs locally with Node or in containers with Docker Compose.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [Deploying to Vercel](#deploying-to-vercel)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Movies](#movies)
  - [Users](#users)
  - [Querying Movies](#querying-movies)
  - [Responses and Errors](#responses-and-errors)
- [Data Models](#data-models)
- [Frontend](#frontend)
- [Security Features](#security-features)
- [Development Scripts](#development-scripts)
- [Postman Collection](#postman-collection)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Movies**
  - List movies with filtering, sorting, field selection and pagination.
  - Top 5 highest-rated movies, movies grouped by genre, and price/rating statistics.
  - Add, update and delete movies (admin only).
- **Authentication**
  - Signup and login with JWT.
  - Password reset by email, with a link that expires after 10 minutes.
  - Tokens issued before a password change stop working.
- **User accounts**
  - Update your name and email, change your password, deactivate your account.
  - Admins can list all users.
- **Frontend**
  - React single-page app covering every API feature, including the admin screens.
- **Security**
  - Secure headers, rate limiting, and protection against NoSQL injection, XSS and parameter pollution.

---

## Technologies Used

| Area | Stack |
| --- | --- |
| API | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 (local MongoDB or MongoDB Atlas) |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| Email | Nodemailer (any SMTP server, e.g. Mailtrap) |
| Frontend | React 19, React Router 7, Vite, Tailwind CSS 4 |
| Containers | Docker, Docker Compose, nginx |
| Hosting | Vercel (static frontend + serverless API) |

---

## Project Structure

```
Express-Api/
├── server.js              # entry point: loads config.env, connects to MongoDB, starts the server
├── index.js               # Express app: security middleware and route mounting
├── Controllers/           # request handlers (auth, movies, users) and the global error handler
├── Models/                # Mongoose schemas (Movie, User)
├── Routes/                # route definitions
├── Utils/                 # query helper, custom error class, email sender, DB connection, DNS fallback
├── api/index.js           # Vercel serverless entry point for the API
├── vercel.json            # Vercel build settings and rewrites
├── data/                  # sample movies and the import/delete script
├── postman/               # Postman collection
├── frontend/              # React client (Vite), with its own Dockerfile and nginx config
├── Dockerfile             # API image
├── docker-compose.yml     # API + frontend
└── .env.example           # template for config.env
```

---

## Prerequisites

- **Node.js 22** (the version the Docker images use) and npm.
- **A MongoDB database**: a local MongoDB server or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
- **An SMTP account** for password reset emails, e.g. a [Mailtrap](https://mailtrap.io) sandbox inbox. Everything else works without it.
- **Docker Desktop** (optional), only for [running with Docker](#running-with-docker).

---

## Running Locally

1. **Clone the repository and install the API's dependencies**

   ```bash
   git clone https://github.com/Agni-glitch/Express-Api.git
   cd Express-Api
   npm install
   ```

2. **Create `config.env`**

   Copy `.env.example` to `config.env` in the project root and fill in the values described under [Environment Variables](#environment-variables). `config.env` is git-ignored; never commit it.

   ```bash
   cp .env.example config.env
   ```

3. **Load the sample movies** (optional)

   ```bash
   node data/import-dev-data.js --import
   ```

4. **Start the API**

   ```bash
   npm run dev
   ```

   The API runs on `http://localhost:3000` and restarts on file changes (nodemon). `npm start` runs it with plain `node`, without restarts. You should see `server has started..` followed by `DB connection successful`.

5. **Start the frontend** in a second terminal

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

6. **Create an admin** (optional)

   Signup always creates a normal user, and there is no endpoint for changing roles. To get an admin, sign up, then set `role` to `"admin"` on that user document in MongoDB (with Compass, the Atlas UI or `mongosh`):

   ```js
   db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
   ```

---

## Environment Variables

The API reads these from `config.env` in the project root. On Vercel they are set in the project settings instead.

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development` returns full error details and stack traces; `production` hides them. |
| `PORT` | No | Port the API listens on. Defaults to `3000`. |
| `CONN_STR` | Yes | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/cineflix` or a `mongodb+srv://...` Atlas string. |
| `SECRET_STR` | Yes | JWT signing secret. Use a long random string (32+ characters). |
| `LOGIN_EXPIRES` | Yes | JWT lifetime, e.g. `30d` or `12h`. A bare number is read as milliseconds. |
| `EMAIL_HOST` | For password reset | SMTP host. |
| `EMAIL_PORT` | For password reset | SMTP port. |
| `EMAIL_USER` | For password reset | SMTP username. |
| `EMAIL_PASSWORD` | For password reset | SMTP password. |
| `FRONTEND_URL` | No | When set, password reset emails link to the frontend's reset page (`<FRONTEND_URL>/reset-password/<token>`) instead of the API endpoint. Use `http://localhost:5173` for local development. |
| `TRUST_PROXY` | No | Number of reverse proxies in front of the API, so rate limiting sees the real client IP. Leave unset when clients connect directly. Docker Compose sets it to `1`, and on Vercel it defaults to `1`. |
| `DNS_SERVERS` | No | Comma-separated DNS servers to use if the SRV lookup for a `mongodb+srv://` string is refused. Defaults to `8.8.8.8,1.1.1.1`. |

The frontend has one optional variable, in `frontend/.env`:

| Variable | Description |
| --- | --- |
| `VITE_API_TARGET` | Where the Vite dev server proxies `/api` to. Defaults to `http://localhost:3000`. |

---

## Running with Docker

Docker Compose builds and runs two containers: the API, and nginx serving the built frontend and proxying `/api` to the API.

```bash
cp .env.example config.env   # then set CONN_STR, SECRET_STR and the EMAIL_* values
docker compose up -d --build
```

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:8080` |
| API | `http://localhost:3000` |

**The database is not part of the Compose stack.** The API container connects to whatever `CONN_STR` in `config.env` points at, so Docker and a local run share the same data when they use the same `config.env`.

- With **MongoDB Atlas**, use your normal `mongodb+srv://...` string. Your IP address must be allowed under Atlas's Network Access settings.
- `127.0.0.1` and `localhost` do **not** work from inside the container, because they refer to the container itself. To reach a MongoDB server running on your own machine, use `mongodb://host.docker.internal:27017/cineflix` (Docker Desktop).

Compose overrides three settings from `config.env`: `PORT` (always `3000` inside the container), `TRUST_PROXY` (`1`) and `FRONTEND_URL` (the frontend's published address). `NODE_ENV` is taken from `config.env`; set it to `production` there to hide stack traces.

Common commands:

```bash
docker compose ps                 # container status
docker compose logs -f api        # follow the API logs
docker compose up -d --build      # rebuild after code changes
docker compose down               # stop and remove the containers
```

Change the published ports with `API_PORT` and `FRONTEND_PORT`:

```bash
FRONTEND_PORT=9000 API_PORT=4000 docker compose up -d
```

In PowerShell, set them first: `$env:FRONTEND_PORT = 9000; docker compose up -d`.

---

## Deploying to Vercel

The repository deploys as a single Vercel project: the built frontend is served as static files, and the Express API runs as one serverless function (`api/index.js`) behind `/api`. Both share an origin, so no CORS setup is needed. `vercel.json` holds the build settings, so nothing has to be configured in the dashboard except environment variables.

1. **Use a MongoDB Atlas cluster.** In Atlas, under Network Access, allow `0.0.0.0/0`: Vercel functions have no fixed IP address.
2. **Import the repository** at [vercel.com/new](https://vercel.com/new), leaving the root directory and build settings as they are. Or use the CLI: `npx vercel`, then `npx vercel --prod`.
3. **Add the environment variables** under Settings > Environment Variables, then redeploy:

   | Variable | Value |
   | --- | --- |
   | `CONN_STR` | Your Atlas `mongodb+srv://...` string. |
   | `SECRET_STR` | A new long random string, e.g. from `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. |
   | `LOGIN_EXPIRES` | e.g. `30d`. |
   | `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` | SMTP settings of a real mail provider. A Mailtrap sandbox does not deliver to real mailboxes. |
   | `FRONTEND_URL` | The deployment's URL, e.g. `https://your-app.vercel.app`, so password reset links open the frontend. |

   `NODE_ENV` and `PORT` are not needed: Vercel runs functions with `NODE_ENV=production`.

Things that behave differently on Vercel:

- `server.js` is not used. `api/index.js` connects to MongoDB on the first request and reuses the connection while the function stays warm.
- The filesystem is read-only, so the movie model's `Log/log.txt` logging is skipped. Errors go to the function logs in the Vercel dashboard.
- The rate limiter counts requests in memory, per function instance, so its limit is approximate. Use a shared store (e.g. Redis) or Vercel's firewall if you need a strict one.

---

## API Reference

All endpoints are under `/api/v1`. Request and response bodies are JSON.

Protected endpoints need the token returned by signup or login, sent as a header:

```
Authorization: Bearer <token>
```

Access levels used below: **Public** (no token), **User** (any logged-in user), **Admin** (logged-in user with `role: "admin"`).

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | Public | Create an account. Body: `name`, `email`, `password`, `confirmPassword`, optional `photo`. Returns a token. |
| `POST` | `/auth/login` | Public | Log in. Body: `email`, `password`. Returns a token. |
| `POST` | `/auth/forgotPassword` | Public | Email a password reset link. Body: `email`. |
| `PATCH` | `/auth/resetPassword/:token` | Public | Set a new password using the emailed token. Body: `password`, `confirmPassword`. Returns a token. |

Example:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"your-password"}'
```

```json
{
  "status": "success",
  "token": "<jwt>",
  "data": { "user": { "_id": "...", "name": "You", "email": "you@example.com", "role": "user" } }
}
```

### Movies

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/movies` | User | List movies. Supports [query options](#querying-movies). |
| `GET` | `/movies/:id` | User | Get one movie. |
| `POST` | `/movies` | Admin | Add a movie. |
| `PATCH` | `/movies/:id` | Admin | Update a movie. |
| `DELETE` | `/movies/:id` | Admin | Delete a movie. Returns `204`. |
| `GET` | `/movies/highest-rated` | Public | The 5 highest-rated movies. |
| `GET` | `/movies/movie-by-genre/:genre` | Public | Count and names of the movies in a genre. |
| `GET` | `/movies/movie-stats` | Public | Rating and price statistics per release year. Only movies rated 4.5 or higher are counted, and only years whose most expensive such movie costs 60 or more are returned. |

Movies whose `releaseDate` is in the future, or that have no `releaseDate`, are left out of every movie response.

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/users/getAllUsers` | Admin | List all active users. |
| `PATCH` | `/users/updateMe` | User | Update your `name` and/or `email`. Other fields are ignored. |
| `PATCH` | `/users/updatePassword` | User | Change your password. Body: `currentPassword`, `password`, `confirmPassword`. Returns a new token. |
| `DELETE` | `/users/deleteMe` | User | Deactivate your account. The user is kept in the database but can no longer log in. Returns `204`. |

### Querying Movies

`GET /movies` accepts these query parameters:

| Parameter | Example | Effect |
| --- | --- | --- |
| Any movie field | `?releaseYear=2010` | Exact-match filter. |
| Comparison operators | `?ratings[gte]=4.5&price[lt]=20` | `gte`, `gt`, `lte`, `lt` on a field. |
| `sort` | `?sort=-ratings,name` | Sort by one or more fields; prefix with `-` for descending. Defaults to newest first. |
| `fields` | `?fields=name,ratings,price` | Return only these fields. |
| `page`, `limit` | `?page=2&limit=5` | Pagination. Defaults to page 1 with 10 movies per page. |

```bash
curl "http://localhost:3000/api/v1/movies?ratings[gte]=4.5&sort=-releaseYear&fields=name,ratings&limit=5" \
  -H "Authorization: Bearer <token>"
```

### Responses and Errors

Successful responses look like this:

```json
{ "status": "success", "length": 5, "data": { "movies": [ ] } }
```

Errors return the HTTP status code and a message:

```json
{ "status": 401, "message": "You are not logged in" }
```

With `NODE_ENV=development` the error response also includes `stackTrace` and the raw `error`. In `production`, unexpected errors return a generic 500 message.

| Status | Meaning |
| --- | --- |
| `400` | Invalid input, validation failure, duplicate value, wrong login details, or an invalid/expired reset token. |
| `401` | Missing, invalid or expired token; or a wrong current password on `updatePassword`. |
| `403` | Logged in, but not an admin. |
| `404` | Movie, user or route not found. |
| `429` | Rate limit reached. |
| `500` | Unexpected server error. |

---

## Data Models

### Movie

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, unique, 4 to 100 characters. |
| `description` | String | Required. |
| `duration` | Number | Required, in minutes. |
| `ratings` | Number | 1 to 5. |
| `totalRating` | Number | |
| `releaseYear` | Number | Required. |
| `releaseDate` | Date | Needed for the movie to appear in results (see [Movies](#movies)). |
| `genres` | [String] | Required. One or more of: Action, Adventure, Sci-Fi, Thriller, Crime, Drama, Romance, Comedy, Horror, Biography. |
| `directors` | [String] | Required. |
| `actors` | [String] | Required. |
| `coverImage` | String | Required. |
| `price` | Number | Required. |
| `durationInHours` | Virtual | `duration / 60`; returned in responses, not stored. |

### User

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required. |
| `email` | String | Required, unique, must be a valid email. |
| `photo` | String | Optional. |
| `role` | String | `user` (default) or `admin`. Cannot be set through the API. |
| `password` | String | Required, at least 8 characters. Stored as a bcrypt hash and never returned. |
| `confirmPassword` | String | Required on signup and password changes; must match `password`. Not stored. |

---

## Frontend

The React client lives in [`frontend/`](frontend/).

```bash
cd frontend
npm install
npm run dev       # development server on http://localhost:5173
npm run build     # production build into frontend/dist
npm run preview   # serve the production build locally
```

The dev server proxies `/api` to the API at `http://localhost:3000`, so start the API first. If the API runs elsewhere, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_TARGET`.

| Page | Path | Access |
| --- | --- | --- |
| Home (highest-rated movies) | `/` | Public |
| Genres | `/genres` | Public |
| Statistics | `/stats` | Public |
| Login, Signup | `/login`, `/signup` | Public |
| Forgot / reset password | `/forgot-password`, `/reset-password/:token` | Public |
| All movies | `/movies` | User |
| Movie details | `/movies/:id` | User |
| Profile | `/profile` | User |
| Add / edit movie | `/movies/new`, `/movies/:id/edit` | Admin |
| Users | `/admin/users` | Admin |

---

## Security Features

- **Helmet** sets secure HTTP headers.
- **Rate limiting**: 1000 requests per hour per IP on `/api`.
- **Body size limit**: JSON bodies over 10 kB are rejected.
- **Data sanitization**: `express-mongo-sanitize` against NoSQL injection, `xss-clean` against XSS.
- **HPP** prevents HTTP parameter pollution.
- **Passwords** are hashed with bcrypt (cost 12) and never returned by the API.
- **Reset tokens** are stored hashed (SHA-256) and expire after 10 minutes.
- **Role checks**: signup cannot set `role`, and admin routes verify it on every request.

---

## Development Scripts

Both scripts act on the database in `CONN_STR`.

- **Import the sample movies from `data/movies.json`**:
  ```bash
  node data/import-dev-data.js --import
  ```

- **Delete all movies** (this removes every movie in that database, not just the samples):
  ```bash
  node data/import-dev-data.js --delete
  ```

`npm run dev` starts the API with nodemon, `npm start` with plain `node`. `npm run start_prod` starts the API with `NODE_ENV=production`. It uses Windows `cmd` syntax, so on macOS or Linux run `NODE_ENV=production npx nodemon server.js` instead.

---

## Postman Collection

Import [`postman/Express-Api.postman_collection.json`](postman/Express-Api.postman_collection.json) into Postman to get ready-made requests for every endpoint.

---

## Troubleshooting

- **The app runs but shows no movies (especially in Docker).** The API is probably connected to a different, empty database. Check `CONN_STR` in `config.env` and confirm the API logs show `DB connection successful`. Also remember that movies without a past `releaseDate` are hidden.
- **On Vercel, API calls return 503 `Service temporarily unavailable`.** The function could not connect to MongoDB. Check `CONN_STR` in the Vercel project settings and that Atlas allows `0.0.0.0/0`, then look at the function logs for the exact error.
- **`querySrv ECONNREFUSED` on startup.** Node could not resolve the `mongodb+srv://` address. The API retries with public DNS servers automatically; set `DNS_SERVERS` to use different ones.
- **The API cannot connect to Atlas.** Add your current IP address under Network Access in Atlas, and check the username and password in `CONN_STR`.
- **`You are not logged in` (401).** The endpoint needs an `Authorization: Bearer <token>` header. Tokens are tied to the database's users, so log in again after switching databases.
- **`docker compose up --build` fails with `failed to fetch oauth token` or other registry errors.** Docker could not download the base images (`node:22-alpine`, `nginx:1.29-alpine`). Check with `docker pull node:22-alpine`; if that fails too, the problem is Docker's network access (proxy, VPN, firewall or antivirus), not this project.
- **Password reset emails do not arrive.** Check the `EMAIL_*` values. With Mailtrap, emails land in the sandbox inbox rather than the real mailbox.

---

## Contributing

Contributions are welcome. See [CONTRIBUTION.md](CONTRIBUTION.md) for the full guidelines. In short:

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

This project is licensed under the MIT License.
