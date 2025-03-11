// controllers/fruits.js
const express = require('express');
const router = express.Router();

const Fruit = require('../models/fruit.js');

router.get('/new', (req, res) => {
  res.status(200).render('fruits/new.ejs');
});

router.post('/', async (req, res) => {
    try {
        if(!req.body.name.trim()) {
            throw new Error('Name cannot be blank');
        }
        await Fruit.create(req.body);
        req.session.message = "Fruit successfully created.";
        res.redirect('/fruits');
    } catch (error) {
        req.session.message = error.message;
        res.redirect("/fruits");
     
    }
});

router.get('/', async (req, res) => {
  const foundFruits = await Fruit.find();
  res.render('fruits/index.ejs', { fruits: foundFruits });
});

module.exports = router;
