*Movie Geek API*
==============

**Overview**
--------
The objective of this Rest API is to build server side of a "Movies" web application clled Movie Geeks. The application will be used to provide information about films, allowing users to sign in and update their personal details, make lists of their favourite movies and find out about the directors and genres. 

**Base URL**
--------

**Authentication**
--------------

| Features                             | Method | Endpoints                        |
-------------------------------------- |--------|----------------------------------|
| GET a list of ALL movies.            | GET    |'/movies'                         |
| GET information about a particular   | GET    |'/movies/:Title                   | 
| movie by it's title.                 |        |                                  |
| GET a description about a genre by   | GET    |'movies/genre/:genreName          |    
| name/title (e.g., “Thriller”);       |        |                                  |
| GET information about a director     | GET    |'movies/director/:directorsName   |
|(bio, birth year, death year) by name;|        |                                  |
| GET actors in a movie                | GET    |'/movies/actors/:Title            |
| Allow new users to register.         | POST   |'/users'                          |
| Update user info.                    | PUT    |'/users/:Username                 |
| Allow users to add a movie to their  | POST   |'/users/:Username/movies/:movieID |
| list of favorites.                   |        |                                  |
| Allow users to remove a movie from   | DELETE |'/users/:Username/movies/:movieID |
| their list of favorites.             |        |                                  |
| Allow existing users to deregister.  | DELETE |'users/Username                   |


**Install Dependencies**
-------------------
npm install

**Dependencies**
------------
"bcrypt": "^5.1.1",
"body-parser": "^1.20.3",
"cors": "^2.8.5",
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

Error Handling
--------------

License
-------