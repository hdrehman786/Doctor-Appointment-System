import { Router } from "express"
import { EditProfile, getAllData, getprofile, login, Logout, register, verifyToken } from "../Controller/userController.js";

const userRoute = Router();

userRoute.post("/register",register);
userRoute.post("/login",login)
userRoute.get("/getprofile",verifyToken,getprofile);
userRoute.post("/logout",verifyToken,Logout);
userRoute.put("/editprofile",verifyToken,EditProfile);

// get all info
userRoute.get("/get-all-data",getAllData);

export default userRoute;