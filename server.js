const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");


// If we read it we gotta be able to write too!
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 8080;

let notesInformation = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// /api/notes, readFileAsync and Sendfile
// HTML "GET" Requests 
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
// This shows the notes posted on the left side
app.get("/api/notes", function (req, res) {
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (savedNotes) {
            return res.json(JSON.parse(savedNotes));
        });
});

// app POST
// "newNote" on index.js holds title (noteTitle) and text (noteText)
// this puts the information to the db.json for the app.get to PULL it

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    notesInformation.push(newNote);
    writeFileAsync(path.join(__dirname, "/db/db.json"), JSON.stringify(notesInformation))
    res.json(newNote);
});

// app DELETE note
// this takes the information on the side and deletes from the app.get
app.delete("/api/notes/:id", function (req, res) {
// "id" pulled from /api/notes/:id index.js
    var id = parseInt(req.params.id);
// readFileAsync to then "write" aka delete
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
    .then(function (savedNotes) {
        notesInformation = JSON.parse(savedNotes)
        notesInformation.splice(id, 1)
        writeFileAsync(path.join(__dirname, "/db/db.json"), JSON.stringify(notesInformation))
    });
    res.json(notesInformation)
})

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
}
)