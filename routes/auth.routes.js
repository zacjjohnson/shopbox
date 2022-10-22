const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const saltRounds = 10;

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


// ========= USER SIGNUP =========

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { firstName, lastName, email, password, storeType, role } = req.body;
  
  if (!firstName || !lastName || !email || !password || !storeType || !role) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please complete all fields.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the email submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message email is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "email already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          storeType,
          role,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: "email need to be unique. The email you chose is already in use." });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});


// ============== LOGIN ================

router.get("/login", isLoggedOut, (req, res) => {
  console.log('SESSION =====> ', req.session);
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your email." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Your password needs to be at least 8 characters long." });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the email, check if the inputted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }

        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("auth/login", { errorMessage: err.message });
    });
});


// ============ USER PROFILE =============

router.get('/profile', (req, res, next)=>{
  User.findById(req.session.user._id)
  .then((user)=>{
    console.log('The user =====> ', user);
    res.render('auth/profile', {user: user})
  })
  .catch((error)=>{
    console.log(error)
  })
})

// =========== UPDATE USER PROFILE DETAILS ============

router.get('/update-profile/:id', (req, res, next) => {
      const theUser = req.session.user
      console.log(req.session);
      console.log('The user ===> ', theUser);
      res.render('auth/update-profile', {user: theUser}) 
})

router.post('/update-profile/:id', (req, res, next)=>{
  const userToUpdate = {
    email: req.body.email,
    role: req.body.role,
    storeType: req.body.storeType,
    address: req.body.address,
    unitNumber: req.body.unitNumber,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip
  }

  User.findByIdAndUpdate(req.session.user._id, userToUpdate)
  .then(theUpdatedUser => {
    // console.log(user._id)
      console.log('The updated user email ===> ', theUpdatedUser);
      res.redirect('/auth/profile');
  }).catch(error => {
      console.log({error});
  })
})


// =============== LOGOUT =================
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});


// ======== SHELVED FEATURE - CHANGE / ADD NEW PASSWORD ===========
router.get('/change-password', (req, res, next)=>{
  res.render("auth/change-password", {currentUser: req.session.user});
});

router.post('/change-password', (req, res, next)=>{
  if(req.body.newpass !== req.body.confirmnewpass){
    res.redirect("/auth/profile")
    // error message should follow here
  }

  User.findById(req.session.user._id)
  .then(resultFromDB => {
     if (bcrypt.compareSync(req.body.oldpass, resultFromDB.password)) {
      const saltRounds = 10;
      bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(req.body.newpass, salt))
      .then(hashedPassword => {
        console.log(hashedPassword)
        User.findByIdAndUpdate(req.session.user._id, {
          password: hashedPassword
        })
        .then(()=>{
          
          res.redirect('/auth/profile');
        })
      })
        .catch((err)=>{
          next(err);
        })
    }
  })
})
// =======================================================

// ======== SHELVED: DISCERN BETWEEN ADMIN AND STAFF USER ==========
// router.get('/profile', (req, res, next)=>{
//   User.findById(req.session.user._id)
//   .then((user)=>{
//     console.log('The user =====> ', user);
//     if (!req.session.user) {
//       return res.redirect('/auth/staff-profile')
//     } 
//     return res.render('auth/admin-profile', {user: user})
//   })
//   .catch((error)=>{
//     console.log(error)
//   })
// })
// =======================================================

module.exports = router;