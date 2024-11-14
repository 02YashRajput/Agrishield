import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";

const router =Router();


router.post("/api/logout",authMiddleware,(req,res)=>{
  
  req.logOut((err)=>{
        if(err) return res.sendStatus(400);
        res.status(200).send({success: true,message: 'user logged out'});
      });



})
export default router;