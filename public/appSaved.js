$(".home-button").on("click", () => {
    window.location.href = "/";
})

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
$.getJSON("/getSaved", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {

        var newDiv = $("<div>");
        newDiv.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].date + "</p>");
        newDiv.append("<button class='btn btn-danger delete-click' data-id='" + data[i]._id + "'>Delete</button>")
        newDiv.append("<button class='btn btn-primary note-click' data-id='" + data[i]._id + "'>Add Notes</button>")
        // Display the apropos information on the page
        $("#articles").append(newDiv);
    }
});

$(document).on("click", ".delete-click", function () {

    var deleteId = $(this).data("id");;

    $(this).parent().hide();
    var id = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/deleteSaved/" + id
    }).then(() => {
        window.location.href = "/saved";
    });
});

// Whenever someone clicks a p tag
$(document).on("click", ".note-click", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            // console.log("/n LOOK HERE!! /n" +JSON.stringify(data));
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            data.note.forEach((element, i) => {
                var newDiv2 = $("<div>");
                newDiv2.append("<h3>" + data.note[i].title + "</h2>");
                newDiv2.append("<h5>" + data.note[i].body + "</h5>");
                newDiv2.append("<button class='btn btn-primary note-delete' data-id='" + data.note[i]._id + "'>Delete Note</button>")
                // Display the apropos information on the page
                $("#notes").append(newDiv2);
            });
            // console.log("first note title" + data.note[0].title + "  " + "first note body" + data.note[0].body);
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

//deleting note
$(document).on("click", ".note-delete", function () {

    var deleteId = $(this).data("id");;

    $(this).parent().hide();
    var id = $(this).data("id");
    $.ajax({
        method: "DELETE",
        url: "/deleteNote/" + id
    }).then(() => {
        // window.location.href = "/saved";
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
