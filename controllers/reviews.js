const review= require("../models/review");
const Listing = require("../models/listing.js");


module.exports.Createreview=async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  const newreview = new review(req.body.review);
  newreview.author= req.user._id;
  listing.review.push(newreview);
  await newreview.save();
  await listing.save();
  req.flash("success","new review is added");
  res.redirect(`/listings/${listing._id}`)
   
}
module.exports.DeleteForm=async(req,res)=>{
  let {id,reviewId}= req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash("success","new review is Deleted");
  res.redirect(`/listings/${id}`)

}