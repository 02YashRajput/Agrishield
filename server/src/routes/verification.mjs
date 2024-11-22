import { Router } from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from '../mongoose-models/user.mjs';

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

const router = Router();

router.get("/api/verify-email", async (req, res) => {
  const { token } = req.query;
  // Check if the token exists and is a string
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ success: false, message: "Token expected" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwt_secret)// Assuming token contains a userId

    // Update the user's isVerified status
    const user = await User.findOneAndUpdate({userId : decoded.userId}, { isVerified: true }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

   
    req.login(user, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: 'Error during login' });
      }
     
      res.status(200).json({ success: true, message: "Email successfully verified",userId: user.userId});
    });

  } catch (err) {
    res.status(400).json({ success: false, msg: "Invalid or expired token", error: err.message });
  }
});

export default router;