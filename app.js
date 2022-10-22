// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();
const bodyParser = require('body-parser');

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "Project-2";

// app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user
  // res.locals.isAdmin = req.session.user.role === 'ADMIN'
  next();
})



// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.use('/', require('./routes/customer.routes'))
app.use('/', require('./routes/purchase.routes'))



// const bookRoutes = );
app.use("/", require("./routes/book.routes"))
app.use("/", require("./routes/movie.routes"))
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;