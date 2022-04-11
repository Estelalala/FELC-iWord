let express = require("express");
let app = express();

app.use(express.urlencoded({ extended: true }));

let handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

let sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db.sqlite3");

app.use(express.static("public"));

let session = require("express-session");

app.use(
    session({
        secret: "some secret code",
        resave: false,
        saveUninitialized: false
    })
);

//code
app.get("/", function (req, res) {
    res.render("home");
});

app.post("/start", function (req, res) {
    // console.log(req.body);
    let username;
    if (req.body.username) {
        username = req.body.username;
    } else {
        username = "You";
    }
    req.session['username'] = username;
    res.render("start", {
        username: req.session['username']
        // username: "Mary"
    });
});

app.post("/learn", function (req, res) {
    let cmd = "SELECT * FROM pool WHERE unit = ?";
    if (req.body.order==2) {
        cmd += " ORDER BY random()";
    }
    if (req.body.number != "all") {
        cmd += " LIMIT " + req.body.number;
    }
    db.all(cmd, [req.body.unit], function (err, rows) {
        console.log(err);
        res.render("learn", {
          pool: rows,
          unit: req.body.unit,
          accent: req.body.accent,
          helpers: {
              addOne: addOne
          }
        })
      })
});

app.post("/play", function (req, res) {
    let timeStamp = new Date().getTime();
    let cmd = "SELECT * FROM pool WHERE unit = ?";
    if (req.body.order==2) {
        cmd += " ORDER BY random()";
    }
    if (req.body.number != "all") {
        cmd += " LIMIT " + req.body.number;
    }
    db.all(cmd, [req.body.unit], function (err, rows) {
        console.log(err);
        res.render("play", {
          pool: rows,
          time1: timeStamp,
          unit: req.body.unit,
          helpers: {
              addOne: addOne
          }
        })
      })
});

let addOne = function(index) {
    return index + 1;
}

app.post("/result", function (req, res) {
    let questionIds = req.body['questionId'];
    let newRow = '';
    let ansArr = [];
    let diffBox = [];
    for (let questionId of questionIds) {
        ansArr.push(req.body[questionId]);
        if (questionId != questionIds[questionIds.length-1]) {
            newRow = newRow + questionId + ',';
        } else {
            newRow = newRow + questionId;
        }
    }
    newRow = "SELECT * FROM pool WHERE rowid in (" + newRow + ")";
    let time = req.body.time;
    diffBox = time.split(',');
    db.all(newRow, [], function (err, rows) {
        console.log(err);
        res.render("result", {
            username: req.session['username'],
            ansArr: ansArr,
            pool: rows,
            diff: diffBox,
            helpers: {
                addOne: addOne
            },
            questionIds: questionIds
        })
    });
});

//code end

app.listen(1000, function () {
    console.log("Listening on port 1000");
});