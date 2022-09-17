
import adminsList from "./adminDetails.js";
import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";

const app = express();
 var myName;
 var Electrician=[];
 var Carpenter=[];
 var Datacenter=[];
 var Others=[];


app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/hostelDB");

const userSchema ={
  name : String,
  email : String,
  password : String,
}


const issueSchema ={
  blockNo : String,
  roomNo : String,
  issue : String,
  description : String,
  name : String,
  status : Number
}

const User = mongoose.model("User", userSchema);
const Issue = mongoose.model("Issue",issueSchema);

app.get("/",function(req,res){
  res.render("login");
});

app.post("/logout",function(req,res){
  res.render("login");
});

app.post("/adminLogout",function(req,res){
  res.render("admin_Login");
})

app.post("/login",function(req,res){
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  //console.log(email);
  User.findOne({email : user_email },function(err,foundUser){
    if(foundUser){
      if(foundUser.password === user_password){
        myName = foundUser.name;
        res.render("home",{name : foundUser.name})
      }
      else {
        res.redirect("/register");
      }
    }
    else{
      res.redirect("/register");
    }
  })
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;
  var user_name = req.body.user_name;

  const new_user = User({
    name : user_name,
    email : user_email,
    password : user_password,
  });
  new_user.save();
  myName=user_name;
  res.render("home",{name : user_name});
  //console.log("saved");
});


app.post("/complaints",function(req,res){
  //console.log(req.body);
  const new_issue = Issue({
    blockNo : req.body.blockNo,
    roomNo : req.body.roomNo,
    issue : req.body.issue,
    description : req.body.description,
    name : myName,
    status : 0
  });
  new_issue.save();
  //console.log("saved");
  res.render("home",{name: myName})
});

app.get("/admin",function(req,res){

});

app.get("/adminLogin",function(req,res){
  res.render("admin_Login");
});

app.post("/admin",function(req,res){
  for(var i=0;i<adminsList.length;i++){
     Electrician=[];
     Carpenter=[];
     Datacenter=[];
     Others=[];
    if(adminsList[i].email===req.body.admin_email && adminsList[i].password===req.body.admin_password){
      //console.log("yes");
      Issue.find(function(err,foundissues){
        //console.log(foundissues);
        for(var i=0;i<foundissues.length;i++){
          if(foundissues[i].issue==="Electrician"){
            Electrician.push(foundissues[i]);
          }
          else if(foundissues[i].issue==="Carpenter"){
            Carpenter.push(foundissues[i]);
          }
          else if(foundissues[i].issue==="Data center"){
            Datacenter.push(foundissues[i]);
          }
          else{
            Others.push(foundissues[i]);
          }
        }
        //console.log(Electrician);
        //console.log(Carpenter);
        //console.log(Datacenter);

        res.render("admin.ejs",{Electrician :Electrician, Carpenter : Carpenter , Datacenter : Datacenter , Others :Others});
      });
    }
  }

});

app.post("/delete",function(req,res){
  const checkedItemID= req.body.checkbox;
  Electrician=[];
  Carpenter=[];
  Datacenter=[];
  Others=[];
  //console.log(checkedItemID);
  Issue.findByIdAndRemove({_id :checkedItemID},function(err){
    if(!err){
      Issue.find(function(err,foundissues){
        //console.log(foundissues);
        for(var i=0;i<foundissues.length;i++){
          if(foundissues[i].issue==="Electrician"){
            Electrician.push(foundissues[i]);
          }
          else if(foundissues[i].issue==="Carpenter"){
            Carpenter.push(foundissues[i]);
          }
          else if(foundissues[i].issue==="Data center"){
            Datacenter.push(foundissues[i]);
          }
          else{
            Others.push(foundissues[i]);
          }
        }
        //console.log(Electrician);
        //console.log(Carpenter);
        //console.log(Datacenter);

        res.render("admin.ejs",{Electrician :Electrician, Carpenter : Carpenter , Datacenter : Datacenter , Others :Others});
      });
    }

  });

});



app.listen(3000);
