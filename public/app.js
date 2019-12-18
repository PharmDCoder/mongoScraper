$(".scrape").on("click", () => {
  $.getJSON("/scrape", function (req, res) {
  }).then(() => {
    window.location.href = "/";
  })
})

$(".clear").on("click", () => {
  $.ajax({
    url: "/clear",
    type: 'DELETE'
  })
  $("#articles").empty();
})

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  $("#articles").empty();
  // For each one
  var titlesArr = [];
  $.getJSON("/getSaved", function (savedData) {
    // For each one
    for (var i = 0; i < savedData.length; i++) {
      titlesArr.push(savedData[i].title);
    }
  }).then(() => {
    for (var i = 0; i < data.length; i++) {
      if ((titlesArr.indexOf(data[i].title.replace("'", "")) === -1)) {
        var newDiv = $("<div class='card align-top col-md-3 col-sm-12' style='display:inline-block;'>");
        newDiv.append("<img src='" + data[i].image + "' class='card-img-top'>");
        newDiv.append("<div class='card-body'></div>");
        newDiv.append("<h5 data-id='" + data[i]._id + "' class='card-title text-center'>" + data[i].title + "</h5>");
        newDiv.append("<p class='card-text'>" + data[i].date + "</p >");
        newDiv.append("<a href='" + data[i].link + "' class='btn btn-success'>View Article</a>");
        newDiv.append("<button class='btn btn-primary save-click' data-title='" + data[i].title.replace("'", "") + "' data-link='"
          + data[i].link + "' data-date='" + data[i].date + "' data-image='" + data[i].image + "'>Save</button>")
        // Display the apropos information on the page
        $("#articles").append(newDiv);
      }
    }
  });

});

$(document).on("click", ".save-click", function () {
  console.log("save button clicked");
  var result = {};

  // Add the text and href of every link, and save them as properties of the result object
  result.title = $(this).data("title");
  result.link = $(this).data("link");
  result.date = $(this).data("date");
  result.image = $(this).data("image");
  $(this).parent().hide();
  $.post("/save-article", result, function (req, res) {
  }).then(() => {
  })
});


