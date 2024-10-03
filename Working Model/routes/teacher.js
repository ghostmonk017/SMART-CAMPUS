const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// Teacher Dashboard
router.get('/', (req, res) => {
    res.render('teacher');
});

// Add Course Marks and Attendance
router.post('/add-course', async (req, res) => {
    const { courseName, marks, attendance, studentId } = req.body;
    const course = new Course({ courseName, marks, attendance, studentId });
    await course.save();
    res.redirect('/teacher');
});

module.exports = router;
    