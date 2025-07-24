import mongoose from "mongoose";



const doctorModel = new mongoose.Schema({
    doctor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    specialisation : {
        type : String,
        required : true
    },
    experience : {
        type : String,
        required : true
    },
    fees : {
        type : String,
        required : true
    },
    education : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        required : true
    }
})

const Doctor = mongoose.model('Doctor', doctorModel);

export default Doctor;