// models/fruit.js

const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,

    }
  });
const Fruit = mongoose.model("Fruit", fruitSchema); // create model

// models/fruit.js

module.exports = Fruit;
