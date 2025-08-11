const express= require("express")
const router= express.Router();
const user= require("../models/user.js")
const wrapAsync= require("../utils/wrapAsync.js");
const passport= require("passport")
const {saveredirectUrl}= require("../middleware.js");
const controllerUser=require("../controllers/user.js")

router.route("/signup")
.get(controllerUser.renderSignupform)
.post(wrapAsync(controllerUser.signup))

router.route("/login")
.get(controllerUser.renderLoginpage)
.post(saveredirectUrl,passport.authenticate("local",{
    failureFlash: true,
    failureRedirect: "/login",
    }),controllerUser.login);
    
router.get("/logout",controllerUser.logout)
module.exports=router;
