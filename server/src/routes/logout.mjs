import { Router } from "express";
import { authMiddlewware } from "../middleware/auth_middleware.mjs";

const router =Router();


router.post("/api/logout",authMiddlewware,(req,res)=>{
  
  req.logOut((err)=>{
        if(err) return res.sendStatus(400);
        res.status(200).send({success: true,message: 'user logged out'});
      });



})
export default router;