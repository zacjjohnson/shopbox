const router = require("express").Router();

const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const Movie = require("../models/Movie.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get('/movies', (req, res, next) => {
    Movie.find()
    .then((movieFromDb) => {
        data = {
            movie: movieFromDb
        }
        res.render('movies/movies', data);
    })
    .catch(err => {
        console.log(err)
    })
    
});


router.get('/movies/createMovie', (req, res, next) => {
    res.render('movies/createMovie');
});


router.post('/movies/createMovie', (req, res, next) => {
    const movieToCreate = {
        title: req.body.title,
        director: req.body.director,
        runtime: req.body.runtime,
        price: req.body.price,
        genre: req.body.genre,
        inventory: req.body.inventory,
        rating: req.body.rating
    }

    Movie.create(movieToCreate)
    .then(newlyCreatedMovie => {
        console.log({newMovie: newlyCreatedMovie})
        res.redirect('/movies');
    })
    .catch(err => console.log(err))
});


router.get('/movies/details/:movieId', (req, res, next) => {
    Movie.findById(req.params.movieId)
    .then((movieFromDb) => {
        res.render('movies/details', movieFromDb)
    })
    .catch(err => console.log(err))
});

router.get('/movies/edit/:movieId', (req, res, next) => {
    Movie.findById(req.params.movieId)
    .then((movieFromDb) => {
        res.render('movies/edit', movieFromDb)
    })
    .catch(err => console.log(err))
});

router.post('/movies/edit/:movieId', (req, res, next) => {
    const movieToUpdate = {
        title: req.body.title,
        director: req.body.director,
        runtime: req.body.runtime,
        price: req.body.price,
        genre: req.body.genre,
        inventory: req.body.inventory,
        rating: req.body.rating
    }

    Movie.findByIdAndUpdate(req.params.movieId, movieToUpdate)
    .then((newlyUpdatedMovie) => {
        console.log({updatedMovie: newlyUpdatedMovie});
        res.redirect(`/movies/details/${newlyUpdatedMovie.id}`);
    })
    .catch(err => console.log(err));
});

router.post('/movies/delete/:movieId', (req, res, next) => {
    Movie.findByIdAndDelete(req.params.movieId)
    .then(() => {
        res.redirect('/movies')
    })
    .catch(err => console.log(err))
});

module.exports = router;

