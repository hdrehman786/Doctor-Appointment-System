import { Router } from "express"
import { EditProfile, getprofile, login, Logout, register, verifyToken } from "../Controller/userController.js";

const userRoute = Router();

userRoute.post("/register",register);
userRoute.post("/login",login)
userRoute.get("/getprofile",verifyToken,getprofile);
userRoute.post("/logout",verifyToken,Logout);
userRoute.put("/editprofile",verifyToken,EditProfile);



export default userRoute;