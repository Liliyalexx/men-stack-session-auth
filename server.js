//dependencies
const express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose"); 
const methodOverride = require("method-override"); 
const morgan = require("morgan"); 
const authController = require("./controllers/auth");
const session = require('express-session');
const fruitsController = require("./controllers/fruits");


//initialize express
const app = express();

//configure settings
dotenv.config();

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3002";
//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(
    session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    if (req.session.message) {
      res.locals.message = req.session.message;
      req.session.message = null;
    }
    next();
  });
  

//router is actually a type of middleware
app.use("/auth", authController);
app.use('/fruits', fruitsController); 

//any Http requests from the browser that comes to /auth,
//  will automatically be forward to the router code insede of the authController

//mount routes
// GET /
app.get("/", (req, res) => {
    res.status(200).render("index.ejs", {
        user:req.session.user
    });
  });

  //protected routes - user must be logged in for access

  app.get('/vip-lounge', (req, res) => {
      if(!req.session.user){
          return res.redirect('/auth/sign-in');
      }
      res.render('vip-lounge.ejs', {
          user: req.session.user
      });
  });

  //the catchall route should always be listd last
    app.get("*", (req, res) => {
        res.status(404).render('error.ejs',{msg: "Page not found"});
    });
  
//custom error fucntion
    const handleServerError = (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Warning! Port ${port} is already in use!`);
        } else {
          console.log('Error:', err);
        }
      }
      
    app.listen(port, () => {
    console.log(`Listening port: ${port}`);
}).on('error',handleServerError);