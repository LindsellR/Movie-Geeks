const express = require('express');
     morgan = require('morgan');
     bodyParser = require('body-parser');
     uuid = require('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js')
const Movies = Models.Movie;
const Users = Models.User;
// const Genres = Models.Genre;
// const Directors = Models.Directors


mongoose.connect('mongodb://localhost:27017/mgDB'), 
  // {
  //   useNewUrlParser: true, 
  //   useUnifiedTopology: true
  // });

app.use(bodyParser.json());

app.use(morgan('common'));

//Return a list of all movies
app.get('/movies', (req, res) => {
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
app.get('/movies/:Title',async (req, res) => {
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
app.get('/movies/genre/:genreName', async (req, res) => {
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
app.get('/movies/director/:directorName', async (req, res) => {
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
app.get('/movies/actors/:Title', async (req, res) => {
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
app.post('/users', async (req, res) => {

  await Users.findOne({ first_name: req.body.first_name, last_name: req.body.last_name})
  .then((user) => {
    if (user) {
      return res.status(400) .send(req.body.first_name + '' + req.body.last_name + 'already exists');
    } else{
      Users.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
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

// //Read/Get all users
// app.get('/users', async (req, res) => {
//   await Users.find()
//     .then ((users) => {
//       res.status(201).json(users)
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: something broke');
//     });
// });

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

//Update a users info by name
app.put('/users/:first_name/:last_name', async (req, res) => {
 await Users.findOneAndUpdate(
      { first_name: req.params.first_name, last_name: req.params.last_name},
  {
    $set:
    {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      birthday: req.body.birthday
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
app.post('/users/:first_name/:last_name/movies/:movieID', async (req, res) => {
  await Users.findOneAndUpdate({ first_name: req.params.first_name, last_name: req.params.last_name},
    {
      $push: {favouriteMovies: req.params.movieID }
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
app.delete('/users/:first_name/:last_name/movies/:movieID', async (req, res) => {
  await Users.findOneAndUpdate({ first_name: req.params.first_name, last_name: req.params.last_name},
    {
      $pull: {favouriteMovies: req.params.movieID }
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

app.delete('/users/:first_name/:last_name', async (req, res) => {
  await Users.findOneAndDelete({
    first_name: req.params.first_name, last_name: req.params.last_name
  })
  .then((user) => {
    if(!user) {
      req.status(400).send(req.params.first_name + req.params.last_name + ' was not found.');
    } else {
      res.status(200).send(req.params.first_name + '' + req.params.last_name + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: Something Broke!');
  });
})

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

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.'); 
});