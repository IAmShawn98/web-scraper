// All Node Packages.
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');

// Require All Models.
// var db = require("./models");

// Required Routing Paths:

// Root Route Router.
const routeHome = require('./routes/home');

// Route To Be Determined.
const routeAbout = require('./routes/about');

// Create New instance of 'express'.
const app = express();

// The Declared PORT We Are Opening When We Listen On Our Node Server.
const PORT = process.env.PORT || 3000;

// Create Brand New Instance of the Handlebars View Engine to Display Our Routed HTML Views.
const hbs = exphbs.create({
  // Our Partials Directory.
  partialsDir: __dirname + '/views/partials',
  // Our Helper Method.
  helpers: helpers()
})

// Use the Handlebars View Engine For Our Application.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Serve Static Files From the '/public' Folder.
app.use(express.static(path.resolve(__dirname, 'public'))); // serve static files

// Specify Our MongoDB Connection String.
mongoose.connect("mongodb://localhost/scrapeDB");
// Save the Connection String into an instance called 'db' so we can verify it.
var db = mongoose.connection;

// Verify our 'db' connection.

// If There Is An Error, Handle It.
db.on("error", console.error.bind(console, "connection error:"));

// Otherwise, open the successful connection.
db.once("open", function () {
  console.log("Connected to Mongoose!");
});

// Routes Are Set Here:

// This is the 'Root Route' Which is the Index HTML View.
// This is triggered when a user loads the localhost:3000
// or fires up the live site for the first time.
app.get('/', (req, res) => routeHome(req, res));

// Route To Be Determined.
app.get('/about', (req, res) => routeAbout(req, res));

// Start Our Server on PORT 3000.
app.listen(process.env.PORT || PORT, () => console.log(`Express server listening on port ${process.env.PORT || PORT}!`));