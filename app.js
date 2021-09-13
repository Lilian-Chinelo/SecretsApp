//jshint esversion:6

// project Name: secretsApp
// Author: Lilian Umeakunne
// Date: 09/09/2021.
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({

    email: String,

    password: String
   
   });

const User = new mongoose.model("User", userSchema);
   
app.get("/", function(req , res){
    res.render("home");
});

app.get("/register", function(req , res){
    res.render("register");
});

app.get("/login", function(req , res){
    res.render("login");
});

// Register new user.

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email: req.body.username,
            password: hash
        });
    
        newUser.save(function(err,){
            if (err) {
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
});
   

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = (req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err);
        }else{
            if (foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
        
                if (result === true){
                    res.render("secrets");

                } else{
                    console.log(err);
                }
                }); 
            }
        }
    });
});







app.listen(3000, function(){
    console.log('listening on port 3000');
});
