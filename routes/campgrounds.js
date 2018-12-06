var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware/index.js")

// INDEX ROUTE
router.get("/", function(req, res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("error")
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"})
        }
    })
    
});

// CREATE

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var txt = req.body.name; 
    var url = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
       id: req.user._id,
       username: req.user.username
   }
    var newCampground = {name: txt, price: price, image: url, description: desc, author: author};
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
        
            // redirect back to /campgrounds 
             res.redirect("/campgrounds")
        }
    })
    
})

router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

// SHOW - shows more info about a specific campground
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found")
            console.log(err)
            res.redirect("back")
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) { 
        if(err || !foundCampground){
            res.flash("error", "Campground not found")
            res.redirect("back")
        } else{
        res.render("campgrounds/edit", {campground: foundCampground})
        }
    })
})


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err || !updatedCampground){
            res.flash("error", "Campground not found")
            res.redirect("/campgrounds")
        } else{
            // redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id)
        }
    } )
    
})

// REMOVE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.flash("error", "Campground not found")
            res.redirect("/campgrounds")
        } else{
            res.redirect("/campgrounds")
        }
    })
})







module.exports = router;