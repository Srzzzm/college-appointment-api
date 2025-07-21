const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/availability/:professorId', authMiddleware, studentController.viewAvailability);

router.post('/book/:appointmentId', authMiddleware, studentController.bookAppointment);

router.get('/appointments', authMiddleware, studentController.viewAppointments);

module.exports = router;