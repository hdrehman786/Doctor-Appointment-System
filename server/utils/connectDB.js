import mongoose from "mongoose"


export const connectDB = async (req,res)=>{
    try {
        const URI =process.env.MONGO_URI
        const connected = await mongoose.connect(URI)
        console.log("Database connected successfully")
        return connected
    } catch (error) {
     return res.json({
        message : "The Database is making problems",
        error : true,
        success : false
      })
    }

}