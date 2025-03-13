const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

// Serve static files from the 'public' directory
app.use('/documentation.html', express.static( 'public'));

// Route for your JSON response
app.get('/movies', (req, res) => {
    res.json('Top ten movies');
});

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Geek app!');
});
 //Error message
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
