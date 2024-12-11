import { Router } from "express";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import { validationResult } from "express-validator";
import { loginSchemaLocal } from "../middleware/validation-models/login-validation.mjs";

const router = Router();

router.post(
  "/api/local/login",
  loginSchemaLocal,
  (req, res, next) => {
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    next();
  },
  passport.authenticate("local", { session: false }), // Session: false to continue without automatic login
  (req, res, next) => {
    // Check if the user provider is 'local'
    if (req.user.provider !== "local") {
      return res.status(400).json({success:true, message: "Cannot log in using this method. Please use the correct provider." });
    }

    if(req.user.isVerified === false){
      return res.status(400).json({ success:false, message: "Your account is not verified. Please verify your email." });
    }

  
    req.login(req.user, async (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .send({success:false, message: "Error logging in" });
      }
      return res
        .status(200)
        .json({ message: "User logged in successfully",success:true , userType :req.user.userType});
    });

  }
);

export default router;
