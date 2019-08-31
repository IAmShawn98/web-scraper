// All Node Packages.
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const helpers = require('./helpers');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const logger = require("morgan");

// Require All Models.
var db = require("./models");

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
});

// Use the Handlebars View Engine For Our Application.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Use Morgan Logger For to Log Requests.
app.use(logger("dev"));

// Serve Static Files From the '/public' Folder.
app.use(express.static(path.resolve(__dirname, 'public'))); // serve static files

// Specify Our MongoDB Connection String.
mongoose.connect("mongodb://localhost/scrapeDB");
// Save the Connection String into an instance called 'db' so we can verify it.
var connectionDB = mongoose.connection;

// Verify our 'db' connection.

// If There Is An Error, Handle It.
connectionDB.on("error", console.error.bind(console, "connection error:"));

// Otherwise, open the successful connection.
connectionDB.once("open", function () {
  console.log("Connected to Mongoose!");
});

// Routes Are Set Here:

// This is the 'Root Route' Which is the Index HTML View.
// This is triggered when a user loads the localhost:3000
// or fires up the live site for the first time.
app.get('/', (req, res) => routeHome(req, res));

// Route to Scrape Site.
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  // Grab the URL of the Site We Want to Scrape.
  axios.get("http://www.echojs.com/").then(function (response) {
    // Load URL String Into Cheerio to Make It Our Shorthand
    // So That It's Easier to Call With.
    var $ = cheerio.load(response.data);

    // Grab All H2s with an article.
    $("article h2").each(function (i, element) {
      // Save Into Empty Result Object.
      var result = {};

      // Grab the Text and Href of Every Link, Saved As Properties of the 'result' Object.
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create New Article Using our 'result' Object Created From Scraping.
      db.Article.create(result)
        .then(function (scrapeDB) {
          // Show All Processed Scrapes In the Console.
          console.log(scrapeDB);
        })
        .catch(function (err) {
          // If There's An Error, Handle It.
          console.log(err);
        });
    });
    // Redirect Back to the Root Route When Finished.
    res.redirect("/");
  });
});

// Start Our Server on PORT 3000.
app.listen(process.env.PORT || PORT, () => console.log(`Express server listening on port ${process.env.PORT || PORT}!`));