const express = require('express');
const resultController = require('../controllers/resultController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
// router.use(authController.protect);

router.post('/', resultController.uploadResults);
router.get('/', resultController.getStudentResults);
router.get('/:studentId/:semester', resultController.getStudentResults2);
router.get('/all', resultController.getAllResults);
router.get('/all2', resultController.getAllResults2);
router.get('/:semester', resultController.getResultsBySemester);

module.exports = router;