import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : false
    },
    role :{
        type : String,
        enum : ["Admin","Doctor","Patient"],
        default : "Patient"
    },
    avatar : {
        type : String,
        default : "https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-thumbnail.png"
    },
    phonenumber : {
        type : String,
        default : ""
    },
    address : {
        type : String,
        default : ""
    },
    gender : {
        type : String,
        default : ""
    },
    age : {
        type : String,
        default : ""
    }
})


const User = mongoose.model("User", userSchema);

export default User;