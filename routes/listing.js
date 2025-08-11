const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { loggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController= require("../controllers/listing.js");
const {storage}= require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })

router.route ("/")
.get( wrapAsync(listingController.index))
.post(loggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createForm))


//New Route
router.get("/new",loggedIn,listingController.rendernewForm);

router.route("/:id")
.get(wrapAsync(listingController.showForm))
.put(loggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateForm))
.delete(loggedIn,isOwner, wrapAsync(listingController.deleteForm))

//Edit Route
router.get("/:id/edit",loggedIn,isOwner, wrapAsync(listingController.editForm));

module.exports= router;