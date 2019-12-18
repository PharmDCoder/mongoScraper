var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
var path = require("path");
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.pbs.org/wgbh/frontline/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".the-latest h6").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text().replace("'", "");
      result.link = $(this).children("a").attr("href");
      result.date = $(this).parent().children("div:last-child").text();
      result.image = $(this).parent().children("div").children("a").children("img").data("src");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.json(response.data);
  });
});

app.post("/save-article", function (req, res) {
  console.log(req.body);
  // Create a new Article using the `result` object built from scraping
  db.Saved.create(req.body)
    .then(function (dbSaved) {
      // View the added result in the console
      console.log(dbSaved);
    })
    .catch(function (err) {
      // If an error occurred, log it
      console.log(err);
    });
});

//Remove Articles
app.delete('/clear', function (req, res) {
  // res.send('Got a DELETE request at /user')
  
  db.Article.remove({}, function (error, removed) {
  });
})

app.delete("/deleteSaved/:id", function(req, res) {
  // We just have to specify which todo we want to destroy with "where"
  db.Saved.findByIdAndRemove(req.params.id, function (error, removed) {
  }).then(function(dbSaved) {
    res.json(dbSaved);
  });
});

app.delete("/deleteNote/:id", function(req, res) {
  // We just have to specify which todo we want to destroy with "where"
  db.Note.findByIdAndRemove(req.params.id, function (error, removed) {
  }).then(function(dbNote) {
    res.json(dbNote);
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Notes from the db
// app.get("/notes", function (req, res) {
//   // Grab every document in the Articles collection
//   db.Note.find({})
//     .then(function (dbNote) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbNote);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Route for getting all Articles from the db
app.get("/saved", function (req, res) {

  res.sendFile(path.join(__dirname, "public/saved.html"));
});

app.get("/getSaved", function (req, res) {

  // Grab every document in the Articles collection
  db.Saved.find({})
    .then(function (dbSaved) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbSaved);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Saved.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbSaved) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbSaved);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Saved.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbSaved) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbSaved);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
