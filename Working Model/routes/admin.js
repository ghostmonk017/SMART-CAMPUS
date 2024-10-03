const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Admin Dashboard
router.get('/', (req, res) => {
    res.render('admin');
});

// Create Teacher and Student
router.post('/create', async (req, res) => {
    const { username, password, role, rollNo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, rollNo });
    await user.save();
    res.redirect('/admin');
});

module.exports = router;
