const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Mongoose Setup
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

// Server Setup
const app = express();
const port = 5000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(port, function() {
  console.log("Server started on port " + port);
});

// '/articles'
// GET: Featches all the articles
// POST: Creates one new article
// PUT: ---
// PATCH: ---
// DELETE: Deletes all the articles
app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, articles) {
      if (!err) res.send(articles);
      else res.send(err);
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (err) res.send(err);
      else res.send("Successfully added a new article.");
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) res.send(err);
      else res.send("Sucessfully deleted all articles.");
    });
  });

// '/articles/:title'
// GET: Fetches the :title article
// POST: ---
// PUT: Updates the :title article
// PATCH: Updates the :title article
// DELETE: Deletes the :title article

app.route("/articles/:title")
  .get(function(req, res) {
    const requestedTitle = req.params.title;
    Article.findOne({
      title: requestedTitle
    }, function(err, foundArticle) {
      if (!err) res.send(foundArticle);
      else res.send(err);
    });
  })
  .put(function(req, res) {
    oldTitle = req.params.title;
    newTitle = req.body.title;
    newContent = req.body.content;
    Article.updateOne({
        title: oldTitle
      }, {
        title: newTitle,
        content: newContent
      },
      function(err) {
        if (err) res.send(err);
        else res.send("Successfully updated article.");
      }
    );
  })
  .patch(function(req, res) {
    oldTitle = req.params.title;
    Article.updateOne({
      title: oldTitle
    }, {
      // this will update ONLY the fields present in req.body
      $set: req.body
    }, function(err) {
      if (err) res.send(err);
      else res.send("Successfully updated article.");
    })
  })
  .delete(function(req, res) {
    const requestedTitle = req.params.title;
    Article.deleteOne({
      title: requestedTitle
    }, function(err) {
      if (err) res.send(err);
      else res.send("Successfully deleted article.")
    });
  });
