import mongoose from "mongoose";



const appointmentScheme = new mongoose.Schema({
    doctor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required : true
    },
    patient : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    date : {
        type: Date,
        required : true
    },
    time : {
        type: String,
        required : true
    },
    fees : {
        type: Number,
        required : true
    },
    status : {
        type: String,
        enum: ['pending', 'approved', 'cancelled',"completed","expired"],
        default: 'pending'
    }
})

export const Appointment = mongoose.model('Appointment', appointmentScheme);

export default Appointment;