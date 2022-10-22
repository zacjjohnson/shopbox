const router = require("express").Router();

const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const Book = require("../models/Book.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Main page the books list will be. 
router.get('/books', (req, res, next) => {
    Book.find()
    .then((bookFromDb) => {
        
        data = {
            book: bookFromDb
        }
        res.render('books/books', data);
    }).catch(err => {
        console.log(err);
    })
    
});

// View page to create the book
router.get('/books/createBook', (req, res, next) => {
    res.render('books/createBook');
});

// Post route creating a book in the database
router.post('/books/createBook', (req, res, next) => {
    const bookToCreate = {
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        price: req.body.price,
        genre: req.body.genre,
        inventory: req.body.inventory
    }

    Book.create(bookToCreate)
    .then(newlyCreatedBook => {
        console.log({newBook: newlyCreatedBook})
        res.redirect('/books');
    })
    .catch(err => console.log(err))
});


// Details Page 

router.get('/books/details/:bookId', (req, res, next) => {
    console.log({ID: req.params.bookId});


    Book.findById(req.params.bookId)
    .then(bookDetail => {
        console.log(bookDetail)
        res.render('books/details', bookDetail);
    })
    .catch(err => console.log(err))
});



router.get('/books/edit/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((bookFromDb) => {
        res.render('books/edit', bookFromDb);
    })
    .catch(err => {
        console.log(err)
    })
});


router.post('/books/edit/:bookId', (req, res, next) => {
    const bookToUpdate = {
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        price: req.body.price,
        genre: req.body.genre,
        inventory: req.body.inventory
    }

    Book.findByIdAndUpdate(req.params.bookId, bookToUpdate)
    .then(newlyUpdatedBook => {
        
        res.redirect(`/books/details/${newlyUpdatedBook.id}`);
    })
    .catch(err => console.log(err))
});

router.post('/books/delete/:bookId', (req, res, next) => {
  
    Book.findByIdAndDelete(req.params.bookId)
    .then(() => {res.redirect('/books')})
    .catch(err => console.log(err));
  });




module.exports = router;

