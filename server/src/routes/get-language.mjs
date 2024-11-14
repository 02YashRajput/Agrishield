import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { User } from "../mongoose-models/user.mjs";
import { check, validationResult } from "express-validator"

const router = Router();



router.get("/api/get-language",(req,res)=>{
  if(req.user){
    res.status(200).json({success:true,message: "User authenticated successfully", language: req.user.language})
  }else{
   
    res.status(200).json({success:false,message: "User not authenticated", language:""})
  }
})



// Define the route with validation
router.post(
  "/api/get-language",
  authMiddleware,
  [
    // Validate that the language is a string with a length of 2
    check('language').isString().isLength({ min: 2, max: 2 }).withMessage('Language must be a 2-character string')
  ],
  async (req, res) => {
    // Check if validation failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      // Find the user and update their language
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { language: req.body.language },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Respond with the updated user
      res.status(200).json({ success: true, message: "Language updated successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error saving language" });
    }
  }
);



export default router;