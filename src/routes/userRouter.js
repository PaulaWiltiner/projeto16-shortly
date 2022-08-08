import { signUp, signIn, logOut } from "../controllers/userController.js";
import { Router } from "express";
import authorization from "../middlewares/authorization.js";
import {
  signUpValidator,
  signInValidator,
} from "../middlewares/userValidator.js";

const router = Router();

// userController.js
router.post("/signup", signUpValidator, signUp);
router.post("/signin", signInValidator, signIn);
router.post("/logout", authorization, logOut);

export default router;
