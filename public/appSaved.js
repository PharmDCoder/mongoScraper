//When home button is clicked re-routes to root page
$(".home-button").on("click", () => {
    window.location.href = "/";
})

// Grab the saved articles as a json
$.getJSON("/getSaved", function (data) {
    // Loops through the saved article json
    for (var i = 0; i < data.length; i++) {
        //creating a new div to store dynamically generated html code
        var newDiv = $("<div class='card align-top col-md-3 col-sm-12' style='display:inline-block;'>");
        //appending new html elements
        newDiv.append("<img src='" + data[i].image + "' class='card-img-top'>");
        newDiv.append("<div class='card-body'></div>");
        newDiv.append("<h5 data-id='" + data[i]._id + "' class='card-title text-center'>" + data[i].title + "</h5>");
        newDiv.append("<p class='card-text'>" + data[i].date + "</p >");
        newDiv.append("<a href='" + data[i].link + "' class='btn btn-success'>View Article</a>");
        newDiv.append("<button class='btn btn-danger delete-click' data-id='" + data[i]._id + "'>Delete</button>");
        newDiv.append("<button class='btn btn-primary note-click' data-id='" + data[i]._id + "'>Add Notes</button>");
        // Apending new HTML elements to existing tag on the DOM
        $("#articles").append(newDiv)
    }
});

//Deletes article when clicked
$(document).on("click", ".delete-click", function () {

    // var deleteId = $(this).data("id");;
    //hides article from DOM
    $(this).parent().hide();
    //sets id = to the data id of the button
    var id = $(this).data("id");
    //dumping data from DB
    $.ajax({
        method: "DELETE",
        url: "/deleteSaved/" + id
    //reloads page after delete
    }).then(() => {
        window.location.href = "/saved";
    });
});

// Whenever someone clicks "Add Note Button"
$(document).on("click", ".note-click", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the save note button
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            // console.log("/n LOOK HERE!! /n" +JSON.stringify(data));
            // Making modal for the note section to pop up
            $(".modal").modal("toggle");
            //Dynamically generates HTML to modal
            $(".modal-title").text(data.title);
            data.note.forEach((element, i) => {
                var newDiv2 = $("<div>");
                newDiv2.append("<h3>" + data.note[i].title + "</h2>");
                newDiv2.append("<h5>" + data.note[i].body + "</h5>");
                newDiv2.append("<button class='btn btn-primary note-delete' data-id='" + data.note[i]._id + "'>Delete Note</button>")
                newDiv2.append("<hr>")
                // Display the apropos information on the page
                $("#notes").append(newDiv2);
            });
            // console.log("first note title" + data.note[0].title + "  " + "first note body" + data.note[0].body);
            // An input to enter a new title
            $("#notes").append("<input class='form-control' id='titleinput' name='title' placeholder='Note Title'>");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' class='form-control' name='body' placeholder='Add Notes Here'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $(".modal-footer").append("<button class='btn btn-danger' data-id='" + data._id + "' id='savenote'>Save Note</button>");

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

    // var deleteId = $(this).data("id");;
    //hides deleted note from the DOM
    $(this).parent().hide();
    //sets variable "id" = the id of the note button
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
            // $("#notes").empty();
            $(".modal").modal("toggle");
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
