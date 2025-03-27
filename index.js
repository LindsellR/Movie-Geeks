const express = require('express');
     morgan = require('morgan');
     bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js')
const Movies = Models.Movie;
const Users = Models.User;
const {check, validationResult} = require('express-validator');

const cors = require('cors');


let allowedOrigins = ['http//localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      //If a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

//mongoose.connect('mongodb://localhost:27017/mgDB'), 
  // {
  //   useNewUrlParser: true, 
  //   useUnifiedTopology: true
  // });

  console.log("MongoDB URI:", process.env.CONNECTION_URI || "Not found");

  mongoose.connect(process.env.CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
  

app.use(bodyParser.json());

let auth = require('./auth')(app);
const passport = require('passport');
require('passport');

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to Movie-Geeks API!');
});

//Return a list of all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
  Movies.find()
    .then ((movies) => {
      res.status(201).json(movies)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: something broke');
    }); 

});

//Return data about a single movie
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: Something Broke!");
    });
});


//Return data about a movie genre by name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => {
   Movies.findOne({"Genre.Name": req.params.genreName})
  .then((movie)=> {
    res.json(movie.Genre);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: Something Broke!')
    });
});

//Return data about a director by name
app.get('/movies/director/:directorName', passport.authenticate('jwt', {session: false}), async (req, res) => {
 Movies.findOne({"Director.Name": req.params.directorName})
  .then((movie)=> {
    res.json(movie.Director); 
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: Something Broke!')
    });
});

//get Actors in a movie
app.get('/movies/actors/:Title', passport.authenticate('jwt', {session: false}), async (req, res) => {
  await Movies.findOne ({Title: req.params.Title})
  .then((movie) =>{
    if (!movie) {
      res.status(404).send(req.params.Title + ' not found')
    }
    res.json(movie.Actors)
  })
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error: Something Broke!')
  });
})

// allow users to register
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    //check validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Email: req.body.Email}) //Search to see if a user with the requested username already exists.
  .then((user) => {
    if (user) {
      //if the user is found, send a response that it already exists
      return res.status(400) .send(req.body.Email + ' already exists');
    } else{

      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then ((user) =>{res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: Something broke!'); 
      }) 
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: Something broke!');
  })
});

//Update a users info by name
app.put('/users/:Username', passport.authenticate('jwt', {session: false}),
[
  check('Username', 'Username is required').isLength({min:5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email', 'Email does not appear to be valid').isEmail(),
],
async (req, res) => {
   //check validation object for errors
   let errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() });
   }
  //Condition to check here.
  if(req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission Denied');
  }
  //End condition.
  let hashedPassword = Users.hashPassword(req.body.Password);
 await Users.findOneAndUpdate(
      { Username: req.params.Username},
  {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Birthday: req.body.Birthday,
      Email: req.body.Email
    }
  },
  {new: true}) //Makes sure the updated document is returned
  .then((updatedUser) => {
    res.json({
     message: 'Users details have been updated',
     updatedUser: updatedUser
    })
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: Something Broke!'); 
  })

});

//Add Movie to users favourite list
app.post('/users/:Username/movies/:movieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
  console.log(req.user);
  //Condition to check
  if(req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission Denied');
  }
  //End condition
  await Users.findOneAndUpdate({ Username: req.params.Username},
    {
      $push: {FavouriteMovies: req.params.movieID }
    },
    {new: true}) //Makes sure the updated document is returned
    .then((updatedUser) => { 
     res.json({
      message: 'Favourite movies has been updated',
      updatedUser: updatedUser});
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send('Error: Something Broke!');
  });
});

//Delete a movie from a users favourite list
app.delete('/users/:Username/movies/:movieID', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //Condition
  if(req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission Denied')
  }
  //End Condition
  await Users.findOneAndUpdate({ Username: req.params.Username},
    {
      $pull: {FavouriteMovies: req.params.movieID }
    },
    {new: true}) //Makes sure the updated document is returned
    .then((updatedUser) => { 
     res.json({
      message: 'Favourite Movies has been updated',
      updatedUser: updatedUser
    })
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send('Error: Something Broke!');
  });
});

//Delete a user
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
  console.log(req.user)
  //Condition
  if(req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission Denied');
  }
  //End Condition
  await Users.findOneAndDelete({
    Username: req.params.Username
  })
  .then((user) => {
    if(!user) {
      req.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: Something Broke!');
  });
})

// //Read/Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then ((users) => {
      res.status(201).json(users)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: something broke');
    });
});

// //Read/Get a user by name
// app.get('/users/:first_name/:last_name', async (req, res) => {
//    Users.findOne({first_name: req.params.first_name, last_name: req.params.last_name})
//   .then((user)=> { 
//     if(!user) {
//       res.status(400).send(req.params.first_name + req.params.last_name + ' was not found.');
//     }
//     res.json(user);
//     })
//     .catch((err) =>{
//       console.error(err);
//       res.status(500).send('Error: Something Broke!')
//     });
// });

app.use((req, res, next) => {
  if (/\/+$/.test(req.path) && req.path.length > 1) {
    res.redirect(301, req.path.replace(/\/+$/, '') + req.url.slice(req.path.length));
  } else {
    next();
  }
});

 //Error message
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  