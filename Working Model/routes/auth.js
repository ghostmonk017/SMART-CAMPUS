const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Sign Up
router.get('/signup', (req, res) => {
    res.render('signup', { error: req.flash('error') });
});

router.post('/signup', async (req, res) => {
    const { username, password, role, rollNo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, rollNo });
    await user.save();
    res.redirect('/login');
});

// Log In
router.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error') });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        res.redirect(`/${user.role}`);
    } else {
        req.flash('error', 'Invalid username or password');
        res.redirect('/login');
    }
});

module.exports = router;
