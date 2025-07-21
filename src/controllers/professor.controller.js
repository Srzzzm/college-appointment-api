const Appointment = require('../models/appointment.model');


exports.addAvailability = async (req, res) => {
    
    if (req.user.role !== 'professor') {
        return res.status(403).send({ message: 'Forbidden: Only professors can add availability.' });
    }
    
    try {
        

        const { timeSlots } = req.body;
        
        
        const availability = timeSlots.map(slot => ({
            professor: req.user.userId,
            startTime: new Date(slot),

            isBooked: false
        }));
        
        
        await Appointment.insertMany(availability);

        res.status(201).send({ message: 'Availability added successfully' });
    } catch (error) {

        res.status(400).send(error);
    }
};


exports.cancelAppointment = async (req, res) => {
    if (req.user.role !== 'professor') {
        return res.status(403).send({ message: 'Forbidden: Only professors can cancel appointments.' });
    }
    
    try {
        
        const appointmentId = req.params.id;
        
        
        const appointment = await Appointment.findOne({ _id: appointmentId, professor: req.user.userId });

        if (!appointment) {
            return res.status(404).send({ message: 'Appointment not found or you do not have permission to cancel it.' });
        }
        
        
        
        appointment.student = undefined;
        appointment.isBooked = false;
        await appointment.save();
        
        res.send({ message: 'Appointment canceled successfully. The time slot is now available again.' });
    } catch (error) {
        res.status(400).send(error);
    }
};