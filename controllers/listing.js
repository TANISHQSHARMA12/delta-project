const Listing= require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken});


module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.rendernewForm= (req, res) => {
  res.render("listings/new.ejs");
}
module.exports.showForm= async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"review",
    populate:{path:"author",},}
  ).populate("owner");
  if(!listing){
    req.flash("error","Listing not found");
    res.redirect("/listings");
  }
  console.log(listing)
  res.render("listings/show.ejs", { listing });
}

module.exports.createForm=async (req, res,next) => {
  let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
   let url = req.file.path;
   let filename =req.file.filename;
  if(!req.body.listing){
  throw new ExpressError(400,"give valid data")
}
 const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;  // Set the owner to current logged-in user
  newListing.image= {url,filename};
  newListing.geometry=  response.body.features[0].geometry;
  let savedListing= await newListing.save();
  console.log(savedListing)
  req.flash("success","new list is added");
  res.redirect("/listings");
}


module.exports.editForm= async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing not found");
    res.redirect("/listings");
  }
  let originalUrl=listing.image.url;
  originalimageUrl=originalUrl.replace("/upload","/upload/h_300/w_250")
  res.render("listings/edit.ejs", { listing,originalimageUrl });
}
module.exports.updateForm=async (req, res) => {
  let { id } = req.params;
   let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file!=="undefined"){
    let url = req.file.path;
   let filename =req.file.filename;
   listing.image= {url,filename}
   await listing.save();
  }
  req.flash("success","new list is Updated");
  res.redirect(`/listings/${id}`);
}
module.exports.deleteForm=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","new list is Deleted");
  res.redirect("/listings");
}