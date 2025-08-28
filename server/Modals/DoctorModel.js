import mongoose from "mongoose";

// const timeSlotSchema = new mongoose.Schema({
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     isBooked: { type: Boolean, default: false },
// });


const dailySlotSchema = new mongoose.Schema({
    day: { type: String, required: true },
    date: { type: Date, required: true },
    slots: [{
        _id : false,
        startTime : {type : String,required : true},
        endTime : {type : String, required : true},
        isBooked : {type : Boolean, default : false}
    }],
});

const doctorModel = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    specialisation: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    fees: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    appointment_date: [dailySlotSchema]
})

const Doctor = mongoose.model('Doctor', doctorModel);

export default Doctor;