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
    email: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: { type: String, required: true },
    birthday: Date,
    favouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User; 