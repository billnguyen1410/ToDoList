//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item!"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  
  
  Item.find({}, function (err, foundItems) {
    
    if (foundItems.length === 0) {
      
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    }else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });

});


// CUSTOM LIST NAME, CREATE NEW ROUTE WITH EXPRESS --> reg.params.customListName
app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  // If we already have the route home, we need to check err
  List.findOne({name: customListName}, (err, foundList) => {
    if (!err){
      if (!foundList){
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })
})


// This is add new Item method.
app.post("/", function (req, res) {
  // add new item for the original route
  const itemName = req.body.newItem;
  // add new item for new list.
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })  
  
  // create if statement to check if listname triggered the post request
  // if it is not the original list, we use the findOne to look for the list.
  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else{
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }


});


// Delete Item by query the Id in DB by req.body.checkbox --> 
// checkbox = value over the ejs
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if(!err){
      console.log("Successfully deleted checked item")
      res.redirect("/");
    }
  })
});


app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
