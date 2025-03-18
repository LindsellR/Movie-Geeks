const express = require('express');
     morgan = require('morgan');
     bodyParser = require('body-parser');
     uuid = require('uuid');
const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

let users = [
 {id: 1,
  "name": "Sara Tulsa",
  "favouriteMovies": []
 },

{id: 2,
  "name": "Shelly France",
  "favouriteMovies": ["Breathless"]
},

{id: 3,
  "name": "Troy Mcann",
  "favouriteMovies": []
}
]
let movies = [
 { 
    "Title": "Breathless",
    "Description": "A small-time crook, hunted by the authorities for a car theft and the murder of a police officer, attempts to persuade a hip American journalism student to run away with him to Italy.",
  
    "Genre": {
        "Name": "Crime",
        "Description": "A type of film or TV programme that tells an exciting and generally serious story"
  },
  
    "Director":  {
        "Name":  "Jean-Luc Godard",
        "Bio": "Jean-Luc Godard (1930-2022) was a French-Swiss filmmaker, screenwriter, and film critic, a pioneer of the French New Wave movement, known for his innovative and influential style, challenging cinematic conventions and exploring new possibilities in both content and form.",
  },
  
    "ImageURL": "https://www.imdb.com/title/tt0053472/mediaviewer/rm1825830145/",
    "Featured": false
  },
    
  {
    "Title": "La Dolce Vita",
    "Description": "A series of stories following a week in the life of a philandering tabloid journalist living in Rome.",

    "Genre": {
        "Name": "Comedy",
        "Description":  "A type of film or TV programme that tells an exciting and generally serious story."
    },

    "Director": {
        "Name": "Frederico Fellini",
        "Bio": "Federico Fellini (January 20, 1920 - 31 October 1993) was an Italian film director and screenwriter, known for his distinctive blend of fantasy, baroque imagery, and earthiness, recognized as one of the greatest and most influential filmmakers of all time.",
    },
    "ImageURL": "https://www.imdb.com/title/tt0053779/mediaviewer/rm1699939328/?ref_=tt_ov_i",  
    "Featured": false
  },
  
  { 
    "Title": "8 1/2",
    "Description": "A harried movie director retreats into his memories and fantasies.",
    
    "Genre": {
        "Name": "Drama",
        "Description":  "A type of film or TV programme that tells an exciting and generally serious story.",
  },
  
    "Director": {
        "Name": "Frederico Fellini", 
        "Bio": "Federico Fellini (January 20, 1920 - 31 October 1993) was an Italian film director and screenwriter, known for his distinctive blend of fantasy, baroque imagery, and earthiness, recognized as one of the greatest and most influential filmmakers of all time.",
  },
    "ImageURL": "https://www.imdb.com/title/tt0056801/mediaviewer/rm3632601345/?ref_=tt_ov_i",
    "Featured": false
  },
  {
    "Title": "Jules et Jim",
    "Description": "Decades of a love triangle concerning two friends and an impulsive woman.",

    "Genre": {
        "Name": "Romance",
        "Description": "A genre that primarily focuses on the development and portrayal of romantic relationships"
  },
    
    "Director": {
        "Name": "François Truffaut",
        "Bio": "François Truffaut (1932-1984) was a French film director, critic, and producer, a key figure in the French New Wave, known for his semi-autobiographical films, like 'The 400 Blows,' and his advocacy of the auteur theory."
  },

    "Image": "https://www.imdb.com/title/tt0055032/mediaviewer/rm2894598400/?ref_=tt_ov_i",
    "Featured": false
  },

  {
    "Title": "Wings of Desire",
    "Description": "An angel tires of his purely ethereal life of merely overseeing the human activity of Berlin's residents, and longs for the tangible joys of physical existence when he falls in love with a mortal.",

    "Genre": {
        "Name": "Fantasy",
        "Description": "A genre that features magical or supernatural elements.",
    },
    
    "Director": {
        "Name": "Wim Wenders",
        "Bio": "Wim Wenders, a German filmmaker, writer, producer, photographer, and author, born in 1945, is a major figure in the New German Cinema, known for films like 'Paris, Texas'. He is  a member of the order Pour le Mérite and since 1996 he has been President of the European Film Academy."
  },
    
    "Image": "https://www.imdb.com/title/tt0093191/mediaviewer/rm3641645825/?ref_=tt_ov_i",
    "Featured": false
  }
]

//Create
app.post('/users', (req, res) => {
  const newUser = req.body

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else{
    res.status(400).send('Users need names')
  }
})

//Create
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
   
  let user = users.find( user => user.id == id);

  if (user) {
    user.favouriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id} favourites.`)
  } else {
    res.status(400).send('No such user')
  }
})

//Delete

app.delete('/users/:id/:movieTitle', (req, res) => {
    const{ id, movieTitle} = req.params;

    let user = users.find( user => user.id == id);
    
      if (user) {
        user.favouriteMovies = user.favouriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been deleted from user ${id} favourites.`);
      } else {
        res.status(400).send('No such user')
      }
    })

//Delete
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id);
  
    if (user) {
      users = users.filter(user => user.id != id);
      res.status(200).send(`User ${id} has been removed.`);
    } else {
      res.status(400).send('No such user')
    }
  })

//Update
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body

  let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No such user')
  }
  
})

//Read
app.get('/movies', (req, res) => {
  res.status(200).json(movies)
})

//Read
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('No such movie')
  }
})

//Read
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre')
  }
})

//Read
app.get('/movies/director/:directorsName', (req, res) => {
  const {directorsName} = req.params;
  const director = movies.find( movie => movie.Director.Name === directorsName ).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director')
  }
})

// Serve static files from the 'public' directory
app.use('/documentation.html', express.static( 'public/documentation.html'));

// Route for your JSON response
app.get('/movies', (req, res) => {
    res.json('Top ten movies');
});

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Geek app!');
});


//Removes tailend forward slash from url
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
