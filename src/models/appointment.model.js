

const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    
    
    professor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    

    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    
    
    startTime: { 
        type: Date, 
        required: true 
    },


    isBooked: { 
        type: Boolean, 
        default: false 
    }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;