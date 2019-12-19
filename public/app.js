//This happens when "Scrape" button is clicked
$(".scrape").on("click", () => {
  //calling the axios function from the server.js
  $.getJSON("/scrape", function (req, res) {
    //after scraping is finished reload the page
  }).then(() => {
    window.location.href = "/";
  })
})

//This is what happens when the "Clear" button is pushed
$(".clear").on("click", () => {
  //deletes results from API call
  $.ajax({
    url: "/clear",
    type: 'DELETE'
  })
  //empties articles on the DOM
  $("#articles").empty();
})

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  //empties previous articles from DOM
  $("#articles").empty();
  //create an empty array to store the titles
  var titlesArr = [];
  //connects w/ server code to look in DB to get object of each saved article
  $.getJSON("/getSaved", function (savedData) {
    // Loops through the saved object and pushes all of the titles to the array
    for (var i = 0; i < savedData.length; i++) {
      titlesArr.push(savedData[i].title);
    }
    //after making the saved articles' title array:
  }).then(() => {
    //looping through the scraped articles
    for (var i = 0; i < data.length; i++) {
      //makes sure that it is only populating scraped articles that are not already saved
      if ((titlesArr.indexOf(data[i].title.replace("'", "")) === -1)) {
        //creating a new div to store dynamically generated DOM contents 
        var newDiv = $("<div class='card align-top col-md-3 col-sm-12' style='display:inline-block;'>");
        //generating the data from the articles DB into elements to display to DOM
        newDiv.append("<img src='" + data[i].image + "' class='card-img-top'>");
        newDiv.append("<div class='card-body'></div>");
        newDiv.append("<h5 data-id='" + data[i]._id + "' class='card-title text-center'>" + data[i].title + "</h5>");
        newDiv.append("<p class='card-text'>" + data[i].date + "</p >");
        newDiv.append("<a href='" + data[i].link + "' class='btn btn-success'>View Article</a>");
        //this button is saving all the data for each article in it
        newDiv.append("<button class='btn btn-primary save-click' data-title='" + data[i].title.replace("'", "") + "' data-link='"
          + data[i].link + "' data-date='" + data[i].date + "' data-image='" + data[i].image + "'>Save</button>")
        // Adding all of this dynamically generated html elements to the DOM under the #articles div
        $("#articles").append(newDiv);
      }
    }
  });

});

//This happens when the save button is clicked (articles get saved)
$(document).on("click", ".save-click", function () {
  //creating an empty result array
  var result = {};

  // Add the text and href of every link, and save them as properties of the result object
  result.title = $(this).data("title");
  result.link = $(this).data("link");
  result.date = $(this).data("date");
  result.image = $(this).data("image");
  //hides the article from the DOM once it has been saved
  $(this).parent().hide();
  //sending saved article data to the database
  $.post("/save-article", result, function (req, res) {
  }).then(() => {
  })
});


