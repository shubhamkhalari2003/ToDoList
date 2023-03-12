const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/pullDB", {useNewUrlParser : true});

const pullSchema = new mongoose.Schema({
  names : [String]
});

const Pull = new mongoose.model("Pull",pullSchema);

const pull1 = new Pull({
  names : ["Rex", "Alpha", "Shubham","Rohit"]
});

// pull1.save();
// console.log("saved in database");

// Pull.findOneAndUpdate(
//   { },
//   { $pull: { names: { $in: ['Rex', 'Rohit'] } } },
//   { new: true }
// )


Pull.findOneAndUpdate(
  { _id : "64042d28f8f928880c002a91"},
  { $pull: { names: { $in: ['Rohit', 'Alpha'] } } },
  { new: true }
)
.then(function(updates){
  if(updates){
    console.log("Successfully Done");
  }
})

// console.log("Done");
// .then(doc => {
//   console.log(doc);
// })
// .catch(err => {
//   console.log(err);
// });
// console.log("Updated");
