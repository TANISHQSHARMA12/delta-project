const express= require("express")
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const review = require("../models/review.js");
const { validatereview } = require("../middleware.js");
const Listing = require("../models/listing.js");
const {loggedIn,isReviewauthor}= require("../middleware.js");
const controllerReview= require("../controllers/reviews.js");



//review
//post review route
router.post("/", loggedIn,validatereview, wrapAsync(controllerReview.Createreview));
//delete review route
router.delete("/:reviewId",loggedIn,isReviewauthor,wrapAsync(controllerReview.DeleteForm));
module.exports=router;