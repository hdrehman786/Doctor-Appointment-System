

import { Router } from "express";

import upload from "../utils/multermidleware.js";
import uploadImageController from "../Controller/imagecontroler.js";
import { verifyToken } from "../Controller/userController.js";



 const imageRouter = Router();


imageRouter.post("/upload",verifyToken,upload.single("image"), uploadImageController)


export default imageRouter;