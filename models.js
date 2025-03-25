const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    
    Genre: {
        Name: {type: String},
        Description: {type: String}
    },
    Director: {
        Name: {type: String},
        Bio: {type: String},
        Born: {type: Date},
        Died: {type: Date}
    },
    Actors: [{type: String}],
    ImagePath: {type: String},
    Featured: {type: Boolean}
});

let userSchema = mongoose.Schema({
    Email: {type: String, required: true},
    Username: {type: String, required: true},
    Password: { type: String, required: true },
    Birthday: Date,
    FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User; 