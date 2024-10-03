const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// Student Dashboard
router.get('/', async (req, res) => {
    const courses = await Course.find({ studentId: req.session.userId });
    res.render('student', { courses });
});

module.exports = router;
