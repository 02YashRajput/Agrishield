import { Router } from "express";
import { signUpLocalSchema } from "../middleware/validation-models/sign-up-validation.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/hashPassword.mjs";
import "../strategies/local-strategy.mjs";
import { User } from "../mongoose-models/user.mjs";

const router = Router();

router.post("/api/local/sign-up", signUpLocalSchema, async (req, res) => {
  // Handle validation results
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res
      .status(400)
      .send({ msg: "Error during validation", err: result.array() });
  }

  // Extract the validated data
  const data = matchedData(req);
  
  try {
    // Hash the password
    data.password = await hashPassword(data.password);
    data.provider = "local";
    
    // Create a new user and save to the database
    const newUser = new User(data);
    const savedUser = await newUser.save();
    
    // Log the user in after successful signup
    req.login(savedUser, async (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .send({ msg: "Error creating user and logging in" });
      }

      return res
        .status(201)
        .json({ msg: "User created and logged in successfully",success:true });
    });

  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      console.log("Duplicate email error:", err);
      return res.status(400).send({success:false, message: "Email already exists" });
    }

    // Log other unexpected errors and respond with a generic message
    console.error("Error creating user:", err);
    return res.status(500).send({ success:false,message: "Error creating user" });
  }
});

export default router;
