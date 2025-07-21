


const Appointment = require('../models/appointment.model');


exports.viewAvailability = async (req, res) => {
    try {
        
        const availableSlots = await Appointment.find({
            professor: req.params.professorId,
            isBooked: false
        }).populate('professor', 'email'); 
        
        res.send(availableSlots);
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.bookAppointment = async (req, res) => {
    
    if (req.user.role !== 'student') {
        return res.status(403).send({ message: 'Forbidden: Only students can book appointments.' });
    }
    
    try {
        
        const appointment = await Appointment.findById(req.params.appointmentId);
        
        
        if (!appointment || appointment.isBooked) {
            return res.status(404).send({ message: 'This appointment slot is not available.' });
        }
        
        
        appointment.student = req.user.userId;
        appointment.isBooked = true;
        await appointment.save();
        
        res.send({ message: 'Appointment booked successfully!', appointment });
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.viewAppointments = async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).send({ message: 'Forbidden: Only students can view their appointments.' });
    }
    
    try {
        
        const appointments = await Appointment.find({ student: req.user.userId })
            .populate('professor', 'email'); 
            
        res.send(appointments);
    } catch (error) {
        res.status(400).send(error);
    }
};