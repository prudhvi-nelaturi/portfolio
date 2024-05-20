const express = require('express');
const bodyParser = require('body-parser');
const transporter = require('./emailConfig');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
const path = require('path');
const Project = require('./models/Project');

const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/portfolio')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Set Handlebars as the templating engine
app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('projects', { projects });
  } catch (err) {
    res.status(500).send('Error retrieving projects');
  }
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: 'prudhvinelaturi@gmail.com',
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('An error occurred while sending the email.');
    }
    res.send('Email sent successfully!');
  });
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
