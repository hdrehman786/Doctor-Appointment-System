import express from "express"
import { configDotenv } from "dotenv";
import { connectDB } from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import userRoute from "./Routes/UserRoutes.js";
import doctorRoute from "./Routes/doctorRoute.js";
import imageRouter from "./Routes/imageRoutes.js";
import appointmentRoute from "./Routes/appointmentRoutes.js";

const app = express();

configDotenv();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin :"https://doctor-appointment-system-client-xi.vercel.app/",
    credentials : true
}))
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const storage = multer.memoryStorage();
const upload = multer({storage})

const PORT = process.env.PORT;


app.get("/",(req,res)=>{
    res.json("Api runnung")
})

app.use("/image", imageRouter)
app.use("/user", userRoute);
app.use("/doctor",doctorRoute)
app.use("/appointment", appointmentRoute);


connectDB().then(
    app.listen(PORT, (req, res) => {
         console.log(`api running ${PORT}`)
    }))
