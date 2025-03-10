//dependencies
const express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose"); 
const methodOverride = require("method-override"); 
const morgan = require("morgan"); 

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

//moutnt routes
// GET /
app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.listen(port, () => {
    console.log(`Listening port: ${port}`);
})