
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

var items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];
// set up for EJS with Express.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);
    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }

});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItems });

});

app.post("/work", (req, res) => {
    

    workItems.push(item);
    res.redirect("/work");
})

app.listen(port, () => {
    console.log("Server started on port 3000");
})