var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware/index.js")

// ==============
// COMMENT ROUTES
// ==============
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

// post route for comments

router.post("/", middleware.isLoggedIn, function(req, res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            // create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    res.flash("error", "You must log in order to do that")
                    console.log(err)
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // save comments
                    comment.save()
                    // connect new comment to campground
                    campground.comments.push(comment)
                    campground.save()
                    // redirect to the show page
                    req.flash("success", "Created a comment")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// RESTFUL routes for comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Campground.findById(req.params.id, function (err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "Can't find that Campground")
           return res.redirect("back")
       } else{
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                res.flash("error", "You must log in order to do that")
                res.redirect("back")
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
            }
        })  
       }
   })
})

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){                  
            res.flash("error", "No can do boss")
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// COMMENT DELETE ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id)
        }
    
    })
})








module.exports = router;