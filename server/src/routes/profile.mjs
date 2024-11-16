import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { User } from "../mongoose-models/user.mjs";
import { FarmerProfile,BuyerProfile } from "../mongoose-models/user-profile.mjs";

const router = Router();

router.get('/api/profile/:id',authMiddleware,async (req, res) => {
  const { id } = req.params;
  let profile;
  try{
    if(id == req.user.userId)
      
    {   
      
    if(req.user.userType === "Farmer"){
      profile = await FarmerProfile.findOne({ userId: req.user.id });
      if(profile){
        const profileData = {
          userName: req.user.userName,
          email: req.user.email,
          phone: req.user.phone,
          profileImage:req.user.profileImage,
          userType: req.user.userType,
          address:profile.address,
          paymentInformation:profile.paymentInformation,
          farmDetails : profile.farmDetails,
          notificationPreferences:profile,
          reviews:profile.reviews,
          rating:profile.rating
        }
        return res.status(200).json({ success: true, message:"User Profile" , user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId},profileData });
      }
      else{
        
        const profileData = {
          userName: req.user.userName,
          email: req.user.email,
          phone: req.user.phone,
          profileImage:req.user.profileImage,
          userType: req.user.userType,
          address:{
            name:"",
            district:"",
            state:"",
            pincode:""
          },
          paymentInformation:{
            bankDetails:{
              accountNumber : "",
              bankName: "",
              accountHolderName:"",
              IFSCCode:""

            },
            upiDetails:{
              upiId:"",
              upiName:"",
            }
          },
          farmDetails :{
            cropsGrown:[],
            farmAddress:"",
            sizeUnit:"",
            farmSize:""
          },

          notificationPreferences:{
            message:true,
            email:true
          },
          reviews:[],
          rating:0
        }
        return res.status(200).json({ success: true, message: "Profile Yet to Edit", user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId},profileData})
      }

      
    }else{

      profile = await BuyerProfile.findOne({ userId: req.user.id});
      if(profile){
        const profileData = {
          userName: req.user.userName,
          email: req.user.email,
          phone: req.user.phone,
          profileImage:req.user.profileImage,
          userType: req.user.userType,
          address:profile.address,
          paymentInformation:profile.paymentInformation,
          notificationPreferences:profile,
          reviews:profile.reviews,
          rating:profile.rating
        }
        return res.status(200).json({ success: true, message:"User Profile" , user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId},profileData });
      }
      else{
        
        const profileData = {
          userName: req.user.userName,
          email: req.user.email,
          phone: req.user.phone,
          profileImage:req.user.profileImage,
          userType: req.user.userType,
          address:{
            name:"",
            district:"",
            state:"",
            picode:""
          },
          paymentInformation:{
            bankDetails:{
              accountNumber : "",
              bankName: "",
              accountHolderName:"",
              IFSCCode:""
            },
            upiDetails:{
              upiId:"",
              upiName:"",
            }
          },

          notificationPreferences:{
            message:true,
            email:true
          },
          reviews:[],
          rating:0
        }
        return res.status(200).json({ success: true, message: "Profile Yet to Edit", user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId},profileData})
      }

    }

  }else{
    const user = User.findOne({userId:id});
    if(user.userType === "Farmer"){
      profile = await FarmerProfile.findOne({ userId: req.user.id });
      if(profile){
        const profileData = {
          userName: user.userName,
          
          profileImage:user.profileImage,
          userType: user.userType,
          address:profile.address,

          farmDetails : profile.farmDetails,
          notificationPreferences:profile,
          reviews:profile.reviews,
          rating:profile.rating
        }
        return res.status(200).json({ success: true, message:"User Profile" , user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId},profileData });
      }
      else{
        
       
        return res.status(404).json({ success: false, message: "User not found", user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId}})
      }

      
    }else{

      profile = await BuyerProfile.findOne({ userId: req.user.id});
      if(profile){
        const profileData = {
          userName: user.userName,
         
          profileImage:user.profileImage,
          userType: user.userType,
          address:profile.address,
         
          notificationPreferences:profile,
          reviews:profile.reviews,
          rating:profile.rating
        }
        return res.status(200).json({ success: true, message:"User Profile" , user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId},profileData });
      }
      else{
        
        return res.status(404).json({ success: false, message: "User not found", user:{name:req.user.userName,profileImage:req.user.profileImage,id:req.user.userId}})
      
      }

    }

    
  }

  }catch(err){

    return res.status(500).json({ success: false, message: 'Server Error' });
  }
})


router.post("/api/profile/upload-profile",async(req,res)=>{

})

export default router;