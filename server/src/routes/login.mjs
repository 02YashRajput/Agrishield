import { Router } from "express";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import { validationResult } from "express-validator";
import { loginSchemaLocal } from "../validation-models/login-validation.mjs";

const router = Router();

router.post(
  "/api/local/login",
  loginSchemaLocal,
  (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      console.log(result.array());
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
    
    // Proceed with login if provider is 'local'
    req.login(req.user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({success:true, message:"User Logged in Successfully"});
    });
  }
);

export default router;
