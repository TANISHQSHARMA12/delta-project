if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}
 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const listingsRouter= require("./routes/listing.js")
const reviewsRouter= require("./routes/review.js");
const Userrouter= require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB
const cookieParser= require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const user= require("./models/user.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))
const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  }
});
store.on("ERROR",()=>{
  console.log("error",err)
})
const sessionProperty={
  store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}
app.use(cookieParser());
app.use(session(sessionProperty));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next()
})
app.use("/listings",listingsRouter)
app.use("/listings/:id/review",reviewsRouter);
app.use("/",Userrouter)
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


// app.all("*",(req,res,next)=>{
//  next( new ExpressError(404,"Page not found"));
//  })
app.use((err,req,res,next)=>{
 let {statusCode=400,message="wrong route"}=err;
 res.status(statusCode).render("error.ejs",{message})
//  res.status(statusCode=500).send({message:message="Something went wrong"});
})
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
  