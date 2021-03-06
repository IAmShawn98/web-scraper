// Require Models.
var db = require("../models");

// Render 'db' Articles.
const routeHome = (req, res) => {
  db.Article.find({isSaved: false})
    .then(function (dbArticle) {
      res.render('home', { Article: dbArticle })
    });
}

// Do Export.
module.exports = routeHome