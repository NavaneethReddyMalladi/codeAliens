import express from "express"
import { login, register, verifyEmail , googleCallback, getProfile, logoutUser} from "../controllers/authControllers.js";

import {passport}  from "../utils/passport.js";

const router = express.Router();

router.post("/login",login);
router.post("/register",register);
router.post("/verify-email",verifyEmail);

// Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


// Google callback
router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/",
  }),

  googleCallback
);


// User profile
router.get("/profile", getProfile);


// Logout
router.get("/logout", logoutUser);

export default router;