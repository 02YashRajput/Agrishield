import { Router } from "express";



const router = Router();



router.get("/api/contact-us",(req,res)=>{
  if(req.user){
    
    res.status(200).json({success:true,message: "User authenticated successfully",user:{name:req.user.userName}})
  }else{
   
    res.status(200).json({success:false,message: "User not authenticated"})
  }
})



export default router;