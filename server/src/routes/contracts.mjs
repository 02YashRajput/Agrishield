import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { Contract } from "../mongoose-models/contract.mjs";
import {User} from "../mongoose-models/user.mjs"
import { acceptContractRequest, rejectContractRequest } from "../utils/sendEmail.mjs";
import {check,validationResult} from "express-validator"
import {MarketPlace} from "../mongoose-models/market-place.mjs"
import dotenv from "dotenv"
dotenv.config()
const router = Router();


router.get("/api/contracts",authMiddleware,async(req,res)=>{

  try{
    if(req.user.userType === "Farmer"){

      const contracts = await Contract.find({farmerId: req.user._id}).select("-_id -farmerId -buyerId -marketPlaceId");
      res.status(200).json({success:true,message:"Contracts found",data:contracts,user: {
        name: req.user.userName,
        id: req.user.userId,
        profileImage: req.user.profileImage,
        userType: req.user.userType,
      },});
    }
    else{
      const contract =await Contract.find({buyerId: req.user._id}).select("-_id -farmerId -buyerId -marketPlaceId");
      res.status(200).json({success:true,message:"Contracts found",data:contract,user: {
        name: req.user.userName,
        id: req.user.userId,
        profileImage: req.user.profileImage,
        userType: req.user.userType,
      },});
    }

  }catch(e){
    console.error("Error getting contract:", e);
    return res.status(500).json({ success: false, message: "Server Error" });
  }

})

router.get("/api/contracts/:contractId",authMiddleware,async(req,res)=>{
  try{
    const contractId = req.params.contractId;
    const contract = await Contract.findOne({contractId:parseInt(contractId,10)}).select("-_id -farmerId -buyerId -marketPlaceId");

    if(!contract){
      return res.status(404).json({ success: false, message: "Contract not found"});
    }

    return res.status(200).json({success:true,message:"Contract Found",data:contract,user: {
      name: req.user.userName,
      id: req.user.userId,
      profileImage: req.user.profileImage,
      userType: req.user.userType,
      email: req.user.email,
      phone: req.user.phone,
    }})

  }catch(err){
    console.error("Error getting contract:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
})


router.post("/api/contracts/accept/:contractId",authMiddleware,async(req,res)=>{
  try{  

    const contractId = req.params.contractId;
    const contract = await Contract.findOneAndUpdate(
      { contractId: parseInt(contractId, 10) }, 
      { $set: { contractStatus: 'Ongoing' } }, 
      { new: true } 
    );  
    if(!contract){
      return res.status(404).json({ success: false, message: "Contract not found"});
    }
    await MarketPlace.findByIdAndDelete(contract.marketPlaceId);

    const farmerProfile = await User.findById(contract.farmerId);


    const url = `${process.env.CLIENT_URL}/contracts/${contract.contractId}`
    acceptContractRequest(farmerProfile.email,url)





    return res.status(200).json({success:true,message:"Contract Accepted"});

  }catch(err){
    console.error("Error accepting contract:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
})
router.delete("/api/contracts/delete/:contractId",authMiddleware,async(req,res)=>{
  try{  

    const contractId = req.params.contractId;
    const contract = await Contract.findOneAndDelete(
      { contractId: parseInt(contractId, 10) }, 
    );  
    if(!contract){
      return res.status(404).json({ success: false, message: "Contract not found"});
    }
    if(req.user.userType === "Buyer"){

      
      const farmerProfile = await User.findById(contract.farmerId);
      rejectContractRequest(farmerProfile.email)    
    }

    return res.status(200).json({success:true,message:"Contract Rejected"});

  }catch(err){
    console.error("Error accepting contract:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
})

router.post(
  "/api/contracts/update-status/:contractId",
  authMiddleware,
  [
    
    check('status')
      .isArray({ min: 2, max: 2 })
      .withMessage('Status should be an array of length 2'),
    check('status[0]')
      .isIn(['initialpaymentStatus', 'deliveryStatus', 'finalpaymentStatus'])
      .withMessage('Invalid status field for the first index'),
    check('status[1]')
      .isIn(['Pending', 'Received', 'Paid', 'Delivered'])
      .withMessage('Invalid status value for the second index')
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Error in format", errors: errors.array() });
    }
  
    const { contractId } = req.params; // Custom contractId field
    const { status, transaction } = req.body; // status as an array of length 2, transaction is optional
  
    try {
      // Retrieve the contract using findOne
      const contract = await Contract.findOne({ contractId });

      if (!contract) {
        return res.status(404).json({ success: false, message: 'Contract not found' });
      }

      // Update the status field based on the received status
      contract[status[0]] = status[1]; // Update the specific status field

      // If the status is 'finalpaymentStatus' and 'Received', set contractStatus to 'Completed'
      if (status[0] === 'finalpaymentStatus' && status[1] === 'Received') {
        contract.contractStatus = 'Completed'; // Set contractStatus to 'Completed'
      }

      // If a transaction is provided, push it to the transactions array
      if (transaction) {
        contract.transactions.push(transaction);
      }

      // Save the updated contract document
      await contract.save();

      // Return success response
      return res.status(200).json({ success: true, message: 'Contract updated successfully' });
     } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
})


export default router;