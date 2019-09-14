// Require Models.
var db = require("../models");

// Render 'db' Saves.
const routeSaves = (req, res) => {
  db.Article.find({isSaved: true})
    .then(function (dbArticle) {
      res.render("saves", { Article: dbArticle })
    });
}

// Do Export.
module.exports = routeSaves