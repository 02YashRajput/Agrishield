import { Router } from "express";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { hashPassword } from "../utils/hashPassword.mjs";
import { User } from "../mongoose-models/user.mjs";

import "../strategies/local-strategy.mjs";

const router = Router();
dotenv.config();

const clientID = process.env.clientID;
const client = new OAuth2Client(clientID);

router.post("/api/auth/google", async (req, res) => {
  const token = req.body.credential;
  let userType ;
  if(req.body.userType){
    userType = req.body.userType;
  }

  try {
    // Verify the token using Google's OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientID, 
    });

    // Extract the payload from the token
    const payload = ticket.getPayload();

    // Extract user info from the payload
    const googleId = payload["sub"]; // Google account ID
    const email = payload["email"];
    const name = payload["name"];

    
    let user = await User.findOne({ email: email });

    if (user) {
     
      if (user.provider !== "google") {
        return res.status(400).json({
          success: false,
          msg: "User is registered with a different provider",
        });
      }

      // If user exists and provider is Google, log them in
      req.login(user, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(500).json({ success:false,msg: "Error logging in" });
        }

        return res.status(200).json({success:true, msg: "User logged in successfully" });
      });
    } else {
      // If user does not exist, create a new user with provider set to "google"
      const newUser = new User({
        password: hashPassword(googleId), // Use Google ID as password (hashed)
        email: email,
        userName: name,
        provider: "google", // Indicate that this user is using Google authentication
        userType: userType, // Add user type if provided in the request
        isVerified:true,
        profileImage : "",
        
      });

      const savedUser = await newUser.save();
      // Log in the newly created user
      
      req.login(savedUser, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(500).json({success : false, msg: "Error creating user or logging in" });
        }

        return res.status(200).json({success:true, msg: "User created and logged in successfully",userId: savedUser.userId});
      });
    }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return res.status(401).json({success:true, msg: "Invalid Google token" });
  }
});

export default router;
