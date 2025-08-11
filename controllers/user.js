const user= require("../models/user.js")

module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signup= async(req,res,next)=>{
    try{
let {username,email,password}=req.body;
    const newUser=  new user({username,email});
    let registeredUser=await user.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err) {return next(err);}
        req.flash("success","Welcome to WanderLust")
        res.redirect("/listings")
  });}
      catch(e){
          req.flash("error",e.message)
          res.redirect("/signup")
      }
      
  
  }
  module.exports.renderLoginpage= (req,res)=>{
      res.render("./users/login.ejs")
  }
  module.exports.login= async (req,res,next)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirecturl=res.locals.redirectUrl||"/listings";
    res.redirect(redirecturl);
    }
    module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you have been logout")
        res.redirect("/listings")
    })
}