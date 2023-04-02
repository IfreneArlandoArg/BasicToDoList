const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


let yearFooter = date.getYear();
let day = date.getDate();
console.log(date.getDay());

//connecting to Mongoose...
mongoose.connect('mongodb+srv://arlando_ifrene:1998@cluster0.u1wzg0y.mongodb.net/todolistDB');

//Items schema.
const itemsSchema = {
    name : String
}

//Items model
const item = mongoose.model("item", itemsSchema);

const app = express();

//View engines allow us to render web pages using template files. 
//These templates are filled with actual data(see folder views) and served to the client.
// setting the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));
//Check this out allows  us to use our css(static code) code in public (folder)...
app.use(express.static("public"));


//creating new items...
const item1 = new item({
    name: "Welcome to your todolist!"
});
const item2 = new item({
    name: "Hit the + button to add an item."
});
const item3 = new item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema] 
}

const List = mongoose.model("List", listSchema);

//item.find({}).then((result) => {
  //  console.log(result[0].name);
    
//});
 

app.get("/", (req,res) => {

    //Finding all the items within the DB...
    item.find({}).then((result) => {

     if(result.length == 0){

        //inserting many items in DB
        item.insertMany(defaultItems).then(() => {
        console.log("Succesfully saved default items to DB ");
        
      });
   
    }
        
    // rendering the ejs file(list.ejs)   
    res.render("list", { titleList : day, newListItems: result, yearFooter: yearFooter });
    });

});

app.get("/:customListName" , ( req, res ) => {
    
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).then((result) => {

        if(!result){
          //create list
        const list = new List({
        name: customListName,
        items: defaultItems
        }); 
    
          list.save();

          res.redirect("/" + customListName );
        } 
        else {
            res.render("list", { titleList : result.name, newListItems: result.items, yearFooter: yearFooter });        }

    });

});

app.get("/about", ( req, res ) =>{
    res.render("about",{yearFooter: yearFooter});
});

app.post("/",( req, res) => {

const listName = req.body.list;

const userItem = new item({name: req.body.newItem});

let str = listName.replace(",","");


if(str === date.getDay()){
    userItem.save();
    res.redirect("/");
}
else{
    List.findOne({name: listName}).then((result) => {
      result.items.push(userItem);
      result.save();
      res.redirect("/" + listName);
    });
}


});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(checkedItemId);
    console.log(listName);
   
    //let str = listName.replace(",","");


    if(listName === day){
    item.findByIdAndRemove(checkedItemId).then(() => {
        console.log("Successfully deleted item...");
        res.redirect("/");
    });

    }else{
        List.findOneAndUpdate({name: listName},{$pull: {items : {_id: checkedItemId}}}).then(() => {
           
            res.redirect("/" + listName);
           

        });
    }

});




app.listen( 3000, () => {

    console.log("Server running on server 3000");
    

});

