const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash")
// const date = require(__dirname + "/date.js")


const app = express();

// var items = ["Buy Food", "Cook Food", "Eat Food"];
// var workItems = ["College Enrollment"];

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://shubham2003:india123@cluster0.3zof2tz.mongodb.net/todoListDB", {useNewUrlParser : true});

const itemSchema = new mongoose.Schema({
  name : String
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name : "Buy Food"
});
const item2 = new Item({
  name : "Get Food"
});
const item3 = new Item({
  name : "Eat Food"
});

const defaultItems = [item1,item2,item3];
var titleName = " ";

const listSchema = {

    name : String,
    items : [itemSchema]

};

const List = new mongoose.model("List", listSchema);



//Home Route
app.get("/", function(req,res){
  // const day = date.getDate();

  Item.find(function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully added to database");
        }
      });
      res.redirect("/");
    }else{
      res.render('list',
      {
        ListTitle : "Today",
        newListItems : foundItems
      })
    }
});
});

app.post("/", function(req,res){
  const itemName = req.body.newItem;

  const title = req.body.submit;

  const newItem = new Item({
    name : itemName
  });

  if(title === "Today"){
    newItem.save();
    res.redirect("/")
  }else{
    List.findOne({name : title},function(err,foundList){
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + title);
    });
  }
});

app.post("/newList",function(req,res){
  titleName = req.body.new;
  // console.log(titleName);
  res.redirect("http://localhost:3000/" + titleName);
})

app.post("/delete",function(req,res){
  const delItem = req.body.checkbox;
  const title = req.body.listTitle;
  // console.log(req.body.listId);

if(title === "Today"){
  Item.findByIdAndRemove(delItem,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully deleted one item");
      res.redirect("/");
    }
  })
}else{
  List.findOneAndUpdate(
  { name : title},
  { $pull: { items: { _id : delItem } } },
  { new: true }
)
.then(function(doc){
  if(doc){
    // console.log(doc);
    // console.log("Successfully deleted item from " + title + " list");
    res.redirect("/" + title);
  }
})
}
})

//custom Route
app.get("/:customListName",function(req,res){
  const customList = _.capitalize(req.params.customListName);

  List.findOne({name : customList},function(err,foundList){
    if(err){
      console.log(err);
    }else{
      if(foundList){
        // console.log("Already exists");
        //Show an Existing list
        res.render('list',
        {
          ListTitle : foundList.name,
          newListItems : foundList.items
        })

      }else{
        // console.log("doesn't exixts");
        //Create a new List
        const list = new List({
          name : customList,
          items : defaultItems
        });
        list.save();
        res.redirect("/" + customList);
      }
    }
  })
});


app.listen(3000, function(){
  console.log("Server started at port 3000");
});
