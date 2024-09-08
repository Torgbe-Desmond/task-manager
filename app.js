const express = require('express');
const app = express();
const connectDB = require('./server/db/connect');
require('dotenv').config();
require('express-async-errors');
const notFound = require('./server/middleware/not-found');
const errorHandlerMiddleware = require('./server/middleware/error-handler');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cors = require('cors')
// Middleware
app.use(express.static('./public')); 
app.use(express.json()); 
app.use(methodOverride('_method'));
app.use(cors({
  origin: 'https://task-manager-lj45.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], // List the headers you want to allow
  credentials: true
}));


app.use(expressLayout); 
app.set('layout', './layouts/main'); 
app.set('view engine', 'ejs'); 

// Routes
app.use('', require('./server/routes/auth'))
app.use('', require('./server/routes/tasks'));

// Error handling middleware
app.use(notFound); 
app.use(errorHandlerMiddleware); 

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); 
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

start();
