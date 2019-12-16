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
        var newDiv = $("<div>");
        newDiv.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].date + "</p>");
        newDiv.append("<button class='btn btn-primary save-click' data-title='" + data[i].title.replace("'", "") + "' data-link='"
          + data[i].link + "' data-date='" + data[i].date + "'>Save</button>")
        // Display the apropos information on the page
        $("#articles").append(newDiv);
      }
    }
  });

});

$(document).on("click", ".save-click", function () {

  var result = {};

  // Add the text and href of every link, and save them as properties of the result object
  result.title = $(this).data("title");
  result.link = $(this).data("link");
  result.date = $(this).data("date");
  $(this).parent().hide();
  $.post("/save-article", result, function (req, res) {
  }).then(() => {
  })
});


