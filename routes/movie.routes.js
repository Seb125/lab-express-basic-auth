const router = require("express").Router();
const Celebrity = require('../models/Celebrity.model.js');
//const Celebrity = require('../models/Celebrity.model.js');
const Movie = require('../models/Movie.model.js');
const User = require('../models/User.model.js');


// all your routes here

router.get('/create', (req, res) => {
    const getCeleb = async (req, res) => {
        try {
            const myCelebrities = await Celebrity.find();
            
            res.render('movies/new-movie', {celebrities: myCelebrities});
        } catch(err) {
            console.log(err)
        }
    }

    getCeleb(req, res);
    
})

router.post('/create', (req, res) => {
    
    const createMovie = async (req, res) => {
        
        try {
            const myMovie = req.body;
            const movie = await Movie.create(myMovie);

            let currentUser = req.session.currentUser
            const foundUser = await User.findOneAndUpdate({email: currentUser.email}, { $push: { movies: movie._id } })


            
            async function pushMovies() {
                if (Array.isArray(myMovie.cast)) {
                   for(let i = 0; i<myMovie.cast.length; i++) {
                        const cel = await Celebrity.findByIdAndUpdate(myMovie.cast[i], { $push: { movies: movie._id } });
                   }
                } else {
                    const cel = await Celebrity.findByIdAndUpdate(myMovie.cast, { $push: { movies: movie._id } });
                }
        }
            const push = await pushMovies();


            res.redirect('/userProfile');
        } catch(err) {
            console.log(err);
           
        }

    }
    
    createMovie(req, res);
    
})

router.get('/', (req, res) => {
    const getMovies = async (req, res) => {
        try {

            let currentUser = req.session.currentUser
            const foundUser = await User.findOne({email: currentUser.email}).populate('movies');

            console.log(foundUser)
            const myMovies = foundUser.movies;
            console.log(myMovies)
            res.render('movies/movies', {myMovies: myMovies});

        } catch(err) {
            console.log(err)
        }
    }

    getMovies(req, res);
})

module.exports = router;