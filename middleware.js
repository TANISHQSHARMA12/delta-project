const Listing=require("./models/listing");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const review = require("./models/review");




module.exports.loggedIn=(req,res,next)=>{
    if(! req.isAuthenticated()){
      req.session.redirectUrl= req.originalUrl;
    req.flash("error","You must be logged in to create a new listing");
     return res.redirect("/login")
  }
  next();
}
module.exports.saveredirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
}
next();
}
module.exports.isOwner= async (req,res,next)=>{
  let { id } = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of the listing");
       return res.redirect(`/listings/${id}`)
    }
    next();
};
module.exports.isReviewauthor= async (req,res,next)=>{
  let { id,reviewId } = req.params;
    let Review= await review.findById(reviewId);
    if(!Review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the author of this review");
       return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.validateListing=(req,res,next)=>{
 let {error}=listingSchema.validate(req.body)
if(error){
  let errmsg= error.details.map(el => el.message).join(",");
  throw new ExpressError(400,errmsg)
}
else{
  next();
}
};
module.exports.validatereview=(req,res,next)=>{
 let {error}=reviewSchema.validate(req.body)
if(error){
  let errmsg= error.details.map(el => el.message).join(",");
  throw new ExpressError(400,errmsg)
}
else{
  next();
}
};
