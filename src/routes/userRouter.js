import { signUp, signIn, logOut } from "../controllers/userController.js";
import { Router } from "express";

const router = Router();

// userController.js
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logOut);

export default router;
