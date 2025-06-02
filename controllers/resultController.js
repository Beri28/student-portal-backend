const Result = require('../models/Result');
const User = require('../models/User');
const AppError = require('../utils/appError');

exports.uploadResults = async (req, res, next) => {
  try {
    const { studentId, semester, subjects, total, average, position, remarks } = req.body;

    const newResult = await Result.create({
      studentId,
      semester,
      subjects,
      total,
      average,
      position,
      remarks
    });

    res.status(201).json({
      status: 'success',
      data: {
        result: newResult
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudentResults = async (req, res, next) => {
  try {
    const {studentId,semester}=req.query
    console.log(studentId)
    // Check if payment is completed (from frontend context)
    // if (req.user.paymentStatus !== 'completed') {
    //   return next(new AppError('Payment required to access results', 402));
    // }

    const results = await Result.findOne({ studentId,semester});
    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        results
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudentResults2 = async (req, res, next) => {
  try {
    const {studentId,semester}=req.params
    console.log(studentId)
    // Check if payment is completed (from frontend context)
    // if (req.user.paymentStatus !== 'completed') {
    //   return next(new AppError('Payment required to access results', 402));
    // }

    const results = await Result.findOne({ studentId,semester});
    res.status(200).json({data:results});
  } catch (err) {
    next(err);
  }
};

exports.getAllResults2 = async (req, res, next) => {
  try {

    const results = await Result.find();
    
    res.status(200).json({data:results});
  } catch (err) {
    next(err);
  }
};
exports.getAllResults = async (req, res, next) => {
  try {

    const results = await Result.find();
    
    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        results
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getResultsBySemester = async (req, res, next) => {
  try {
    if (req.user.paymentStatus !== 'completed') {
      return next(new AppError('Payment required to access results', 402));
    }

    const result = await Result.findOne({
      studentId: req.user.studentId,
      semester: req.params.semester
    });

    if (!result) {
      return next(new AppError('No results found for this semester', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        result
      }
    });
  } catch (err) {
    next(err);
  }
};