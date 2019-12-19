var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
  },
  // `link` is required and of type String that must be unique to prevent duplications (for some reason unique wasn't working on "title")
  link: {
    type: String,
    required: true,
    unique: true
  },
    // `date` is required and of type String
  date: {
    type: String,
    required: true
  },
    // `image` is required and of type String
  image: {
    type: String,
    required: true
  }

});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
