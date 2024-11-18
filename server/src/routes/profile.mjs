import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { User } from "../mongoose-models/user.mjs";
import { FarmerProfile,BuyerProfile } from "../mongoose-models/user-profile.mjs";
import multer from "multer";
import cloudinary from '../config/cloudinary.mjs';
import { profileUpdateValidation } from "../middleware/validation-models/profile-validation.mjs";
import {validationResult, matchedData } from "express-validator";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const router = Router();


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


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
          notificationPreferences:profile.notificationPreferences,
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
          notificationPreferences:profile.notificationPreferences,
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
    const user =await User.findOne({userId:id});
    if(user.userType === "Farmer"){
      profile = await FarmerProfile.findOne({ userId:user._id });
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
      
      profile = await BuyerProfile.findOne({ userId:user._id });
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


router.post("/api/profile/upload-avatar", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    
    // Extract user ID from auth middleware (assumes the middleware adds `req.user.id`)
    const userId = req.user.id;

    // Upload to Cloudinary
    cloudinary.uploader.upload_stream(
      {
        folder: "avatars", 
        resource_type: "auto", 
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Error uploading file." });
        }

        try {
          // Update user's profile image in the database
          await User.findByIdAndUpdate(
            userId,
            { profileImage: result.secure_url }, // Update the profileImage field
            { new: true } // Return the updated document
          );
          // Respond with the updated URL
          return res.status(200).json({ url: result.secure_url });
        } catch (dbError) {
          console.error("Database update error:", dbError);
          return res.status(500).json({ message: "Error updating user profile image." });
        }
      }
    ).end(req.file.buffer); // Stream the file buffer to Cloudinary
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Error processing upload." });
  }
});




router.post("/api/profile/upload-profile", authMiddleware, profileUpdateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const userId = req.user.id;
  try {
    // Update user email and phone if they are different
    if (req.user.email !== data.email) {
      await User.findByIdAndUpdate(userId, { email: data.email });
    }
    if (req.user.phone !== data.phone) {
      await User.findByIdAndUpdate(userId, { phone: data.phone });
    }

    // Check if user is a Farmer or Buyer and update or create profile accordingly
    if (req.user.userType === "Farmer") {
      // Check if FarmerProfile exists
      const farmerProfile = await FarmerProfile.findOne({ userId: userId });
      if (farmerProfile) {
        // Update the existing FarmerProfile
        await FarmerProfile.findOneAndUpdate({userId:userId}, {
          
          farmDetails : data.farmDetails,
          address :  data.address,
          notificationPreferences : data.notificationPreferences,
          paymentInformation : data.paymentInformation

        });
      } else {
        // Create a new FarmerProfile
        await FarmerProfile.create({
          userId: userId,
          farmDetails : data.farmDetails,
          address :  data.address,
          notificationPreferences : data.notificationPreferences,
          paymentInformation : data.paymentInformation
        });
      }
    }

    // Same logic for BuyerProfile
    if (req.user.userType === "Buyer") {
      const buyerProfile = await BuyerProfile.findOne({ userId: userId });
      if (buyerProfile) {
        
        // Update the existing BuyerProfile and return the updated document
        const updatedBuyerProfile = await BuyerProfile.findOneAndUpdate(
         { userId: userId},
          {
            address: data.address,
            notificationPreferences: data.notificationPreferences,
            paymentInformation: data.paymentInformation,
          },
          { new: true } // Ensures the updated document is returned
        );
      
 
      } else {
        
        // Create a new BuyerProfile
        await BuyerProfile.create({
          userId: userId,
          address :  data.address,
          notificationPreferences : data.notificationPreferences,
          paymentInformation : data.paymentInformation// assuming buyerDetails is part of the incoming data
        });
      }
    }

    // Return a success response
    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error("Error uploading profile:", error);
    res.status(500).json({ message: "Error uploading profile." });
  }
});


router.put('/profile/update-rating/:id',async(req,res)=>{
  const {id} = req.params;
  try{
    const user = await User.findOne({userId:id});
    if(user){
      
    }
  }catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({success:false, message: "Error updating rating." });
  }
})


export default router;