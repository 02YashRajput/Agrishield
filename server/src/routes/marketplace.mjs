import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { MarketPlace } from "../mongoose-models/market-place.mjs";
import { listContractValidator } from "../middleware/validation-models/list-contract-validation.mjs";
import {
  FarmerProfile,
  BuyerProfile,
} from "../mongoose-models/user-profile.mjs";
import { validationResult} from "express-validator";
import dotenv from "dotenv";
import { User } from "../mongoose-models/user.mjs";
import { Contract } from "../mongoose-models/contract.mjs";
import { sendContractRequest } from "../utils/sendEmail.mjs";
import { Negotiations } from "../mongoose-models/negotiations.mjs";
import { validateNegotiationDetails } from "../middleware/validation-models/start-negotiations.mjs";
import { createChat } from "../utils/start-chat.mjs";
import { Chat } from "../mongoose-models/chat.mjs";
import { readFile } from "fs/promises";
const data = JSON.parse(
  await readFile(
    new URL("../utils/stateDistictsAndCrops.json", import.meta.url)
  )
);



async function getCropsDistrict(state, district) {
  const data = JSON.parse(
    await readFile(
      new URL("../utils/stateDistictsAndCrops.json", import.meta.url)
    )
  );

  // Check if the state exists in the data
  if (data.states && data.states[state]) {
    // Check if the district exists in the state
    if (data.states[state][district]) {
      return data.states[state][district]; // Return the crops array
    } else {
      throw new Error(`District '${district}' not found in state '${state}'.`);
    }
  } else {
    throw new Error(`State '${state}' not found.`);
  }
}


async function getCropsForDistrict(state, district) {
  const data = JSON.parse(
    await readFile(
      new URL("../utils/stateDistictsAndCrops.json", import.meta.url)
    )
  );

  // Check if the state exists in the data
  if (data.states && data.states[state]) {
    // Check if the district exists in the state
    if (data.states[state][district]) {
      return data.states[state][district]; // Return the crops array
    } else {
      throw new Error(`District '${district}' not found in state '${state}'.`);
    }
  } else {
    throw new Error(`State '${state}' not found.`);
  }
}
dotenv.config();
const router = Router();
const baseAwsUrl = process.env.AWS_S3_URL;
const clientUrl = process.env.CLIENT_URL;
router.get("/api/marketplace", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const distance = parseInt(req.query.distance);
  const crop = req.query.crop || "";

  try {
    if (req.user.userType === "Buyer") {
      const results = await MarketPlace.find({ buyerId: req.user.id })
        .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
        .skip(skip) // Skip the first `skip` documents
        .limit(limit) // Limit the number of documents returned
        .select("-_id -buyerId");

      res.status(200).json({
        success: true,
        message: "Listed Items Found",
        results,
        user: {
          name: req.user.userName,
          id: req.user.userId,
          profileImage: req.user.profileImage,
          userType: req.user.userType,
        },
      });
    } else {
      const profile = await FarmerProfile.findOne({ userId: req.user.id });
      if (!profile) {
        return res.status(401).json({ message: "User Profile not found" });
      }
      
      const userLocation = profile.address.location;

      let marketplaceDocs = await MarketPlace.find().select("-_id -buyerId");

      const districtCrops = await getCropsDistrict(profile.address.state,profile.address.district);


      let productQuantities = {};
      let districtQuantities = {};
      marketplaceDocs.forEach(doc => {
        const quantity = parseInt(doc.productQuantity, 10); 
        
        if (districtCrops.includes(doc.productName)) {
          if (districtQuantities[doc.productName]) {
            districtQuantities[doc.productName] += quantity; 
          } else {
            districtQuantities[doc.productName] = quantity; 
          }
        } else {
          if (productQuantities[doc.productName]) {
            productQuantities[doc.productName] += quantity;
          } else {
            productQuantities[doc.productName] = quantity;
          }
        }
      });

      

      if (distance !== 0) {
        const calculateDistance = (loc1, loc2) => {
          const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
          const R = 6371;
          const dLat = toRadians(loc2.latitude - loc1.latitude);
          const dLon = toRadians(loc2.longitude - loc1.longitude);
          const lat1 = toRadians(loc1.latitude);
          const lat2 = toRadians(loc2.latitude);
  
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) *
              Math.cos(lat2) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
          return R * c;
        };
  
        marketplaceDocs = marketplaceDocs.filter((doc) => {
          const docDistance = calculateDistance(userLocation, doc.location);
          const matchesCrop = crop ? doc.productName === crop : true;
          return docDistance <= distance && matchesCrop;
        });
      } else if (crop) {
        marketplaceDocs = marketplaceDocs.filter(
          (doc) => doc.productName === crop
        );
      }
      
      const results = marketplaceDocs.slice(skip, skip + limit);

      res.status(200).json({
        success: true,
        message: "Listed Items Found",
        results,
        productQuantities,
        districtQuantities,
        user: {
          name: req.user.userName,
          id: req.user.userId,
          profileImage: req.user.profileImage,
          userType: req.user.userType,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post(
  "/api/marketplace/list-contract",
  authMiddleware,
  listContractValidator,
  async (req, res) => {
    try {
      // If validation errors exist, handle them here
      const errors = validationResult(req); // Import validationResult from 'express-validator'
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      // Access the validated data from req.body
      const {
        productName,
        initialPaymentAmount,
        finalPaymentAmount,
        deadline,
        additionalInstructions,
        productQuantity,
        productVariety,
        deliveryPreference
      } = req.body;
      const user = req.user; // Assuming the user info is available from the authMiddleware
      // Determine which profile to fetch based on userType
      let userProfile;
      if (user.userType === "Farmer") {
        userProfile = await FarmerProfile.findOne({ userId: user._id });
      } else {
        userProfile = await BuyerProfile.findOne({ userId: user._id });
      }
      const contract = new MarketPlace({
        buyerId: user._id,
        productName,
        buyerName: user.userName,
        buyerProfileImage: user.profileImage,
        buyerProfileLink: `/profile/${user.userId}`,
        productImage: `${baseAwsUrl}/${productName.split("/").join(" ")}.jpg`,
        initialPaymentAmount,
        finalPaymentAmount,
        deliveryPreference,
        deadline,
        additionalInstructions,
        productQuantity,
        productVariety,
        location: userProfile.address.location,
      });

      const savedContract = await contract.save();
      const newContract = savedContract.toObject();
      delete newContract._id;
      delete newContract.buyerId;
      res.status(200).json({
        success: true,
        message: "Contract Listed Successfully",
        newContract,
      });
    } catch (err) {
      console.error("Error creating contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

router.put(
  "/api/marketplace/list-contract",
  authMiddleware,
  listContractValidator,
  async (req, res) => {
    const errors = validationResult(req); // Import validationResult from 'express-validator'
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {
      initialPaymentAmount,
      finalPaymentAmount,
      deadline,
      deliveryPreference,
      additionalInstructions,
      productQuantity,
      marketPlaceId,
    } = req.body;
    try {
      const updatedContract = await MarketPlace.findOneAndUpdate(
        { marketPlaceId: marketPlaceId },
        {
          initialPaymentAmount,
          finalPaymentAmount,
          deadline,
          deliveryPreference,
          additionalInstructions,
          productQuantity,
        },
        { new: true }
      );
      if (!updatedContract) {
        return res
          .status(404)
          .json({ success: false, message: "Contract not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Contract updated successfully" });
    } catch (err) {
      console.error("Error creating contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

router.delete(
  "/api/marketplace/list-contract/:marketplaceId",
  authMiddleware, // Your authentication middleware

  async (req, res) => {
    let { marketplaceId } = req.params; // Extract marketPlaceId from the request body
    if (!marketplaceId) {
      return res
        .status(400)
        .json({ success: false, message: "Marketplace ID is required" });
    }
    marketplaceId = parseInt(marketplaceId, 10);
    try {
      const deletedContract = await MarketPlace.findOneAndDelete({
        marketPlaceId: parseInt(marketplaceId, 10),
      });
      if (!deletedContract) {
        return res
          .status(404)
          .json({ success: false, message: "Contract not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Contract deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

router.post(
  "/api/marketplace/request-contract/:marketplaceId",
  authMiddleware,
  async (req, res) => {
    let { marketplaceId } = req.params; // Extract marketPlaceId from the request body
    if (!marketplaceId) {
      return res
        .status(400)
        .json({ success: false, message: "Marketplace ID is required" });
    }
    marketplaceId = parseInt(marketplaceId, 10);
    try {
      const marketPlaceContract = await MarketPlace.findOne({
        marketPlaceId: parseInt(marketplaceId, 10),
      });
      if (!marketPlaceContract) {
        return res
          .status(404)
          .json({ success: false, message: "Contract not found" });
      }

      const buyer = await User.findById(marketPlaceContract.buyerId);

      const contract = new Contract({
        marketPlaceId: marketPlaceContract._id,
        contractStatus: "Requested",
        farmerId: req.user._id,
        farmerName: req.user.userName,
        farmerProfileImage: req.user.profileImage,
        farmerProfileLink: `/profile/${req.user.userId}`,
        productImage: `${baseAwsUrl}/${marketPlaceContract.productName}.jpg`,
        productName: marketPlaceContract.productName,
        productVariety : marketPlaceContract.productVariety,
        buyerName: marketPlaceContract.buyerName,
        buyerId: marketPlaceContract.buyerId,
        buyerProfileImage: marketPlaceContract.buyerProfileImage,
        buyerProfileLink: marketPlaceContract.buyerProfileLink,
        initialpaymentStatus: "Pending",
        finalpaymentStatus: "Pending",
        deliveryStatus: "Pending",
        deliveryPreference:marketPlaceContract.deliveryPreference,
        qualityCheck:false,
        deadline: new Date(marketPlaceContract.deadline),
        initialPaymentAmount: marketPlaceContract.initialPaymentAmount,
        finalPaymentAmount: marketPlaceContract.finalPaymentAmount,
        productQuantity: marketPlaceContract.productQuantity,
      });
      
      const savedContract = await contract.save();

      const participants = [{userId: savedContract.farmerId,name: savedContract.farmerName,profileLink : savedContract.farmerProfileLink }, { userId : savedContract.buyerId, name: savedContract.buyerName, profileLink : savedContract.buyerProfileLink }];
      const participantIds = participants.map(participant => participant.userId.toString());

   
    const existingChat = await Chat.findOne({
        $and: [
            { 'participants.userId': { $all: participantIds } }, // Both user IDs must be present
           
        ],
    });
    if (!existingChat) {
        
      const response = await createChat(participants);
      if(!response){
        return res.status(500).json({ success: false, message: "Failed to create chat" });
      }
    }

      const url = `${clientUrl}/contracts/${savedContract.contractId}`;
      sendContractRequest(buyer.email, url);


      res
        .status(200)
        .json({ success: true, message: `Successfully Requested Contract"` });
    } catch (err) {
      console.error("Error requesting contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

router.post(
  "/api/marketplace/start-negotiations/:marketplaceId",
  authMiddleware,
  validateNegotiationDetails,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    let { marketplaceId } = req.params; 
    if (!marketplaceId) {
      return res
        .status(400)
        .json({ success: false, message: "Marketplace ID is required" });
    }
    marketplaceId = parseInt(marketplaceId, 10);
    try {
      const marketPlaceContract = await MarketPlace.findOne({
        marketPlaceId: parseInt(marketplaceId, 10),
      });
      if (!marketPlaceContract) {
        return res
          .status(404)
          .json({ success: false, message: "Contract not found" });
      }
      const {
        initialPaymentAmount,
        finalPaymentAmount,
        productQuantity,
        deadline,
        deliveryPreference,
      } = req.body;
      const buyer = await User.findById(marketPlaceContract.buyerId);
      const negotiations = new Negotiations({
        marketPlaceId: marketPlaceContract._id,
        farmerId: req.user._id,
        farmerName: req.user.userName,
        farmerProfileImage: req.user.profileImage,
        farmerProfileLink: `/profile/${req.user.userId}`,
        productImage: `${baseAwsUrl}/${marketPlaceContract.productName}.jpg`,
        productName: marketPlaceContract.productName,
        productVariety:marketPlaceContract.productVariety,
        deliveryPreferenceBuyer : marketPlaceContract.deliveryPreference,
        deliveryPreferenceFarmer: deliveryPreference,
        buyerName: marketPlaceContract.buyerName,
        buyerId: marketPlaceContract.buyerId,
        buyerProfileImage: marketPlaceContract.buyerProfileImage,
        buyerProfileLink: marketPlaceContract.buyerProfileLink,
        deadlineBuyer: new Date(marketPlaceContract.deadline),
        initialPaymentAmountBuyer: marketPlaceContract.initialPaymentAmount,
        finalPaymentAmountBuyer: marketPlaceContract.finalPaymentAmount,
        productQuantityBuyer: marketPlaceContract.productQuantity,
        initialPaymentAmountFarmer:initialPaymentAmount,
        finalPaymentAmountFarmer:finalPaymentAmount,
        productQuantityFarmer:productQuantity,
        deadlineFarmer:deadline,
        lastUpdated: "Farmer",
      });

      const savedNegotiations = await negotiations.save();
      res
        .status(200)
        .json({ success: true, message: `Successfully Started Negotiation` });
    } catch (err) {
      console.error("Error requesting contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);
export default router;
