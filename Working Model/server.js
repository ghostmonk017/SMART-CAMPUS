const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/User');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/smart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Handle Signup
app.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    role
  });

  try {
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error signing up!');
  }
});

// Handle Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('No user found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid Credentials');
  }

  req.session.user = user;
  res.redirect('/dashboard');
});





// Dashboard route after login
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;

  // Redirect to the appropriate dashboard based on role
  if (user.role === 'student') {
    res.render('dashboard-student', { user });
  } else if (user.role === 'teacher') {
    res.render('dashboard-teacher', { user });
  } else if (user.role === 'admin') {
    res.render('dashboard-admin', { user });
  } else {
    res.status(403).send('Access denied');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');
  });
});

// Student view grades
app.get('/view-grades',  async (req, res) => {
  if (req.session.user.role === 'student') {
    const student = await User.findById(req.session.user._id);
    res.render('view-grades', { grades: student.grades });
  } else {
    res.redirect('/');
  }
});

// Teacher view classes
app.get('/teacher/classes',  async (req, res) => {
  if (req.session.user.role === 'teacher') {
    const teacher = await User.findById(req.session.user._id).populate('classes');
    res.render('teacher-classes', { classes: teacher.classes });
  } else {
    res.redirect('/');
  }
});

// Admin manage users (a simple example)
app.get('/admin/manage-users',  async (req, res) => {
  if (req.session.user.role === 'admin') {
    const users = await User.find();
    res.render('manage-users', { users });
  } else {
    res.redirect('/');
  }
});


// 
// 
// 
// 

app.get('/contact',   (req, res) => {
res.render("./contact.ejs");
});


app.get('/dashboardstd',   (req, res) => {
  res.render("./dashboard-student.ejs");
  });


  app.get('/profile',   (req, res) => {
    res.render("./users-profile.ejs");
    });
  
app.get("/component",(req,res)=>{
  res.render("./component.ejs");
})
app.get("/attendance",(req,res)=>{
  res.render("./attendance.ejs");
})

app.get("/tattendance",(req,res)=>{
  res.render("./teacherattendence.ejs");
})

app.get("/events",(req,res)=>{
  res.render("./teacherevent.ejs");
})

app.get("/sevents",(req,res)=>{
  res.render("./studentevent.ejs");
})

app.get("/sschedule",(req,res)=>{
  res.render("./studentscheduling.ejs");
})


app.get("/tschedule",(req,res)=>{
  res.render("./teacherscheduling.ejs");
})



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
