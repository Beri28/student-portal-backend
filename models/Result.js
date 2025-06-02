const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    ref: 'User'
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['1', '2', '3', '4']
  },
  subjects: [
    {
      name: {
        type: String,
        required: [true, 'Subject name is required']
      },
      score: {
        type: Number,
        required: [true, 'Score is required'],
        min: 0,
        max: 100
      },
      grade: {
        type: String,
        required: [true, 'Grade is required']
      }
    }
  ],
  courses: [
    {
      courseName: {
        type: String,
        required: [true, 'Subject name is required']
      },
      courseCode: {
        type: String,
        required: [true, 'Subject code is required']
      },
      ca: {
        type: Number,
        required: [true, 'Score is required'],
        min: 0,
        max: 100
      },
      exam: {
        type: Number,
        required: [true, 'Score is required'],
        min: 0,
        max: 100
      },
      final: {
        type: Number,
        required: [true, 'Score is required'],
        min: 0,
        max: 100
      },
      grade: {
        type: String,
        required: [true, 'Grade is required']
      },
      gradePoints: {
        type: String,
        required: [true, 'Grade is required']
      },
      credits: {
        type: Number,
      }
    }
  ],
  total: {
    type: Number,
  },
  average: {
    type: Number,
  },
  position: Number,
  gpa: Number,
  remarks: String,
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);