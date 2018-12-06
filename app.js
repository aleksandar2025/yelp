var express               = require("express");
var app                   = express();
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose");
var flash                 = require("connect-flash");
var passport              = require("passport");
var LocalStrategy         = require("passport-local")
var methodOverride        = require("method-override")
var Campground            = require("./models/campground");
var User                  = require("./models/user");
var seedDB                = require("./seeds");
var Comment               = require("./models/comment");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSanitizer      = require('express-sanitizer');
var url                   = process.env.DATABASEURL || "mongodb://localhost/yelp_campv12Deployed";

mongoose.set("useFindAndModify", false);
mongoose.connect(url, { useNewUrlParser: true });



mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
app.locals.moment = require('moment');
// seed the database
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "machine spirit",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use passing the user variable to every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")

    next()
});
// refactoring
var commentRoutes     = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var authRoutes        = require("./routes/index");

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Start");
});