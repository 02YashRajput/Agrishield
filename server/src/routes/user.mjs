import {Router} from "express"


const router = Router();

router.get("/api/user",(req,res)=>{
  if(req.user){
    return res.status(200).json({success:true, message:"User Found",userId:req.user.userId})
  }else{
    return res.status(401).json({success:false, message:"User Not Found"})
  }
})
export default router