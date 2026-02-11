import { Router } from "express";
import { loginUser, registerUser } from "../controllers/usercontroller.js";

const router=Router()

router.post('/register_user',registerUser,loginUser)

export default router