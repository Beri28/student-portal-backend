const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
app.use(cors());
// app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const authRoutes = require('./routes/authRoutes');
const resultRoutes = require('./routes/resultRoutes');
const userRoutes = require('./routes/userRoutes');

app.get('/',(req,res)=>{res.send("Hello")})

let resultsRequest=0

const countRequests=(req,res,next)=>{
  resultsRequest++
  console.log(resultsRequest)
  next()
}
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/results',countRequests ,resultRoutes);
app.use('/api/v1/users', userRoutes);

// Error handling
app.use(globalErrorHandler);

module.exports = app;