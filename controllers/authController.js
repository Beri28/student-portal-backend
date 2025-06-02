const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, studentId, password } = req.body;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      studentId,
      password
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: `${firstName} ${lastName}`,
          email,
          studentId,
          paymentStatus: newUser.paymentStatus
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { studentId, password } = req.body;
    console.log(req.body)
    // 1) Check if studentId and password exist
    if (!studentId || !password) {
      throw new Error("Please provide student ID and password")
      // return res.status(400).json({
      //   message:"Please provide student ID and password",
      // })
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ studentId }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect student ID or password")
      // return res.status(401).json({
      //   message:"Incorrect student ID or password",
      // })
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        studentId: user.studentId,
        paymentStatus: user.paymentStatus
      }
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
      message:"Couldn't login",
      error:err.message
    })
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { paymentStatus: 'completed' },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};