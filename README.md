# 🎬 Movie Geeks API

## Overview

The **Movie Geek REST API** is the backend for the Movie Geeks web application (And the client side Angular web App "myFlix"). It provides endpoints for users to:

- View movie data, including details about genres, directors, and actors
- Register and manage user accounts
- Add or remove favorite movies

The API is built with **Node.js**, **Express**, **MongoDB**, and uses **JWT authentication** via **Passport**.

---

## Base URL

https://movie-geeks-one.vercel.app

---

## Authentication

Most endpoints require JWT authentication. Include the following header in requests:

Authorization: Bearer <your_token>

---

## API Endpoints

### 🎥 Movies

| Functionality                 | Method | Endpoint                         |
| ----------------------------- | ------ | -------------------------------- |
| Get all movies                | GET    | `/movies`                        |
| Get movie by title            | GET    | `/movies/:Title`                 |
| Get genre description by name | GET    | `/movies/genre/:genreName`       |
| Get director info by name     | GET    | `/movies/director/:directorName` |
| Get actors in a movie         | GET    | `/movies/actors/:Title`          |

---

### 👤 Users

| Functionality                    | Method | Endpoint           |
| -------------------------------- | ------ | ------------------ |
| Register new user                | POST   | `/users`           |
| Get user details by username     | GET    | `/users/:Username` |
| Update user info                 | PUT    | `/users/:Username` |
| Deregister (delete) user account | DELETE | `/users/:Username` |

---

### ⭐ Favorite Movies

| Functionality               | Method | Endpoint                           |
| --------------------------- | ------ | ---------------------------------- |
| Add movie to favorites      | POST   | `/users/:Username/movies/:movieID` |
| Remove movie from favorites | DELETE | `/users/:Username/movies/:movieID` |

---

## Installation




1. ### Clone the repository:

git clone https://github.com/yourusername/movie-geek-api.git
cd movie-geek-api

2. ### Install Dependencies:

npm install

3. ### Environment Setup

Create a .env file in the root directory and add the following:

MONGODB_URI=<your MongoDB URI>
JWT_SECRET=<your secret key>

4. ### Run the app locally:

npm start

Dependencies
------------
"bcrypt": "^5.1.1",  
"body-parser": "^1.20.3",  
"cors": "^2.8.5". 
"dotenv": "^16.4.7",  
"express": "^4.21.2",  
"express-validator": "^7.2.1",  
"jsonwebtoken": "^9.0.2",  
"mongoose": "^8.12.1",  
"morgan": "^1.10.0",  
"passport": "^0.7.0",  
"passport-jwt": "^4.0.1",  
"passport-local": "^1.0.0",  
"uuid": "^9.0.1"

Install them via:  
npm install

### API Documentation with JSDoc

You can generate static documentation using JSDoc.

Generate Docs:  
npx jsdoc index.js passport.js models.js -d docs

### View Docs:
Open the generated file:

docs/index.html

This will include documentation for:

- index.js (Express routes)
- passport.js (authentication logic)
- models.js (Mongoose schemas)

### Error Handling

The API uses structured error messages and appropriate HTTP status codes. Common codes include:

- 400 Bad request
- 401 Unauthorized
- 404 Not found
- 500 Server error.  
Logging is handled with morgan.


### Frontend

You can find the client application here:  
https://movie-geeks-classics.netlify.app/login


#### AI Assistance Disclosure

Portions of this documentation were produced with the assistance of AI tools (e.g., OpenAI's ChatGPT). The final content has been reviewed and verified by the project developer for accuracy and alignment with the project.
