import { Router } from "express";
import { signUpLocalSchema } from "../middleware/validation-models/sign-up-validation.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/hashPassword.mjs";
import "../strategies/local-strategy.mjs";
import { User } from "../mongoose-models/user.mjs";
import jwt from 'jsonwebtoken';
import { sendVerifcationEmail } from "../utils/sendEmail.mjs";


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
    data.password = hashPassword(data.password);
    data.provider = "local";
    data.profileImage = "";
    // Create a new user and save to the database
    const newUser = new User(data);
    const savedUser = await newUser.save();
    
    
    // Log the user in after successful signup

    const jwt_secret = process.env.JWT_SECRET
    const token = jwt.sign({userId:savedUser.userId},jwt_secret);
    await sendVerifcationEmail(savedUser.email,token);
    return res
        .status(201)
        .json({ msg: "User created and logged in successfully",success:true });
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({success:false, message: "Email or Phone already exists" });
    }

    // Log other unexpected errors and respond with a generic message
    console.error("Error creating user:", err);
    return res.status(500).json({ success:false,message: "Email or Phone already exists" });
  }
});

export default router;
