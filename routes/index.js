const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index');
});

// Access vault page
router.get('/access', (req, res) => {
  res.render('access', { error: null });
});

// Create vault page
router.get('/create', (req, res) => {
  res.render('create');
});

// About page
router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;