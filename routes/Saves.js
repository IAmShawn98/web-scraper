// Require Models.
var db = require("../models");

// Render 'db' Saves.
const routeSaves = (req, res) => {
  db.Article.find()
    .then(function (dbArticle) {
      res.render('Saves', { Article: dbArticle })
    });
}

// Do Export.
module.exports = routeSaves