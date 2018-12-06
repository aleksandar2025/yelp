var middlewareObj = {};
var Campground = require("../models/campground.js")
var Comment = require("../models/comment.js")


middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in at all
    if(req.isAuthenticated()){
        // otherwise redirect
                Campground.findById(req.params.id, function(err, foundCampground){
                // || fixes the bug of the valid id that's not assigned to anything in the database returning null and crashing the application
                if(err || !foundCampground){
                    req.flash("error", "Campground not found")
                    res.redirect("/campgrounds")
                } else {
                            // does user own the campground
                            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                               next()
                            } else {
                                req.flash("error", "No can't do boss")
                                res.redirect("back")
                            }
                }
            })
        
    } else {
    req.flash("error", "You need to be logged in to do that")
    // if not, redirect
    res.redirect("/login")
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in at all
    if(req.isAuthenticated()){
        // otherwise redirect
                Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    res.flash("error", "Comment not found")
                    res.redirect("/campgrounds")
                } else {
                            // does user own the comment
                            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                               next()
                            } else {
                                res.flash("error", "You don't have persmission to do that")
                                res.redirect("back")
                            }
                }
            })
        
    } else {
        req.flash("error", "You need to be logged in to do that")
    // if not, redirect
    res.redirect("/login")
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "Please Login First!")
    res.redirect("/login")
};

module.exports = middlewareObj;