import {Router} from "express"
import { agentAuthMiddleware } from "../middleware/auth_middleware.mjs";
import { signUpLocalSchema } from "../middleware/validation-models/sign-up-validation.mjs";
import { validationResult,matchedData } from "express-validator";
import { hashPassword } from "../utils/hashPassword.mjs";
import "../strategies/local-strategy.mjs";
import { User } from "../mongoose-models/user.mjs";
const router = Router()


router.get("/api/agent",agentAuthMiddleware,async(req,res)=>{
  res.json({success: true, message: "Agent authenticated successfully"})
})

router.post("/api/agent/user",agentAuthMiddleware,signUpLocalSchema,async(req,res)=>{

  
    
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .send({ msg: "Error during validation", err: result.array() });
    }
    const data = matchedData(req);
  
    try {
      // Hash the password
      data.password = hashPassword(data.password);
      data.provider = "local";
      data.profileImage = "";
      data.isVerified = true;
      const newUser = new User(data);
      const savedUser = await newUser.save();
      return res
      .status(201)
      .json({ msg: "User created and logged in successfully",success:true });
  }catch(err){
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({success:false, message: "Email or Phone already exists" });
    }

    console.error("Error creating user:", err);
    return res.status(500).json({ success:false,message: "Email or Phone already exists" });

  }

})

export default router;