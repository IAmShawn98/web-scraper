// All Node Packages.
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
// const helpers = require('./helpers');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const logger = require('morgan');
const moment = require('moment');
const Handlebars = require('handlebars');
const MomentHandler = require('handlebars.moment');

// Initialize Moment Handlebars.
MomentHandler.registerHelpers(Handlebars);
console.log(moment());

// Require All Models.
var db = require('./models');

// Required Routing Paths:

// Root Route Router.
const routeHome = require('./routes/Article');
const routeSaves = require('./routes/Saves');

// Create New instance of 'express'.
const app = express();

// The Declared PORT We Are Opening When We Listen On Our Node Server.
const PORT = process.env.PORT || 3000;

// Create Brand New Instance of the Handlebars View Engine to Display Our Routed HTML Views.
const hbs = exphbs.create({
  // Our Partials Directory.
  partialsDir: __dirname + '/views/partials',
  // Our Helper Method.
  // helpers: helpers()
});

// Use the Handlebars View Engine For Our Application.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Log Routing Events [MORGAN Package].
app.use(logger('dev'));

// Serve Static Files From the '/public' Folder.
app.use(express.static(path.resolve(__dirname, 'public')));

// Specify Our MongoDB Connection Strings:

// Main Scrape Database.
mongoose.connect("mongodb://localhost/scrapeDB");

// Save the Connection Strings Into An Instance Called 'db' So We Can Verify It.
var connectionDB = mongoose.connection;

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

// Route to Saved Articles.
app.get('/saves', (req, res) => routeSaves(req, res));

// Route to Scrape Site.
app.get("/scrape", function (req, res) {
  // Grab the URL of the Site We Want to Scrape.
  axios.get("https://www.nytimes.com/section/todayspaper").then(function (response) {
    // Load URL String Into Cheerio to Make It Our Shorthand
    // So That It's Easier to Call With.
    var $ = cheerio.load(response.data);

    // Grab All News Classes.
    $(".css-10wtrbd").each(function () {
      // Create An Empty Array For Later Population.
      var result = {};

      // Scrape Every 'h2' Tag Containing Article Headers.
      result.title = $(this)
        .children("h2")
        .text();
      // Scrape Every Link Available.
      result.link = $(this)
        .children("div")
        .children("a")
        .attr("href")
      // Scrape Every 'p' Tag Containing Brief Article Descriptions.
      result.articleDescribe = $(this)
        .children("p")
        .text();

      // Create New Article Using the 'result' Object Created From Scraping.
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

// Delete All Articles.
app.get("/clearAll", function (req, res) {
  db.Article.remove({}, function (err) {
    if (err) {
      // If There's An Error, Handle It.
      console.log(err);
    } else {
      console.log("Articles Successfully Removed!");
    }
  });
  // Redirect Back to the Root Route When Finished.
  res.redirect("/");
});

// Delete Article.
app.post("/saves/:id", function (req, res) {
  // Using the Article Model, Delete Any Article Clicked On.
  db.Article.findOneAndRemove({ "_id": req.params.id })
    // Execute the above query
    .exec(function (err) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Redirect Back to the Root Route When Finished.
        res.redirect("/saves");
      }
    });
});

// Get Article Data As 'Json' Format.
app.get("/scrapej", function (req, res) {
  db.Article.find({}, function (err, response) {
    // If There Are Errors, Handle Them.
    if (err) {
      console.log(err);
    } else {
      res.json(response);
    }
  });
});

// Save An Article.
app.post("/articles/:id", function (req, res) {
  // Using the Article Model, update the 'isSaved' state to true.
  db.Article.findByIdAndUpdate({ "_id": req.params.id }, { "isSaved": true })
    // Execute the Update Method Above.
    .exec(function (err) {
      // If There Are Errors, Handle Them.
      if (err) {
        console.log(err);
      }
      else {
        // Redirect to the Saves Route When Finished.
        res.redirect("/saves");
      }
    });
});


// Add Article Notes.
app.post("/articles/:id", function (req, res) {
  var content = req.body.comment;
  articleID = req.params.id;

  var commentObj = {
    comment: content,
  }

  var newNote = new Comment(commentObj);

  newNote.save(function (err, article) {
    if (err) {
      console.log(err);
    } else {
      console.log(article._id);
      console.log(articleID);
    }

    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comment: article._id } },
      { new: true }
    )
  });
});

// Start Server on PORT 3000.
app.listen(process.env.PORT || PORT, () => console.log(`Express server listening on port ${process.env.PORT || PORT}!`));