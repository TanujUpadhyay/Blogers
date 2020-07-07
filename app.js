//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDb",{useNewUrlParser:true});


const postSchema={
  title:String,
  content:String
};

const contactSchema={
  name:String,
  email:String
}

const Post = mongoose.model("Post",postSchema);
const Contact = mongoose.model("Contact",contactSchema);




app.get("/", function(req, res){

  Post.find({},(err,posts)=>{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  }); 
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.post("/contact",(req,res)=>{
  const contact = new Contact({
    name:req.body.name,
    email:req.body.email
  });
  contact.save((err)=>{
    if(!err)
      res.redirect("/contact",{sendMessage:"message send Succesfully..."});
  })
})

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save((err)=>{
    if(!err)
      res.redirect("/");
  });


  app.get("/posts/:postid",(req,res)=>{
    const requestedPostid = req.params.postid;
    Post.findOne({ _id : requestedPostid},(err,post)=>{
      res.render("post",{
        title:post.title,
        content:post.content
      });
    });
  });
 

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
