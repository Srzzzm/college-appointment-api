const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professor.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/availability', authMiddleware, professorController.addAvailability);


router.delete('/appointments/:id', authMiddleware, professorController.cancelAppointment);

module.exports = router;