import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { MarketPlace } from "../mongoose-models/market-place.mjs";
import { listContractValidator } from "../middleware/validation-models/list-contract-validation.mjs";
import {
  FarmerProfile,
  BuyerProfile,
} from "../mongoose-models/user-profile.mjs";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
const router = Router();
const baseAwsUrl = process.env.AWS_S3_URL;
router.get("/api/marketplace", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const distance = parseInt(req.query.distance) || 10;
  const crop = req.query.crop || "";

  try {
    if (req.user.userType === "Buyer") {
      const results = await MarketPlace.find({ buyerId: req.user.id })
        .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
        .skip(skip) // Skip the first `skip` documents
        .limit(limit) // Limit the number of documents returned
        .select("-_id -buyerId");

      res
        .status(200)
        .json({
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
      if (!profile || !profile.address || !profile.address.location) {
        return res.status(400).json({ message: "User location not found" });
      }

      const userLocation = profile.address.location;

      let marketplaceDocs = await MarketPlace.find();

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

      const results = marketplaceDocs.slice(skip, skip + limit);

      res
        .status(200)
        .json({
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
      } = req.body;
      const user = req.user; // Assuming the user info is available from the authMiddleware
      // Determine which profile to fetch based on userType
      let userProfile;
      if (user.userType === "Farmer") {
        userProfile = await FarmerProfile.findOne({ userId: user._id });
      } else {
        userProfile = await BuyerProfile.findOne({ userId: user._id });
      }
      console.log(userProfile);
      const contract = new MarketPlace({
        buyerId: user._id,
        productName,
        buyerName: user.userName,
        buyerProfileImage: user.profileImage,
        buyerProfileLink: `/profile/${user.userId}`,
        productImage: `${baseAwsUrl}/${productName}.jpg`,
        initialPaymentAmount,
        finalPaymentAmount,
        deadline,
        additionalInstructions,
        productQuantity,
        location: userProfile.address.location,
      });

      const savedContract = await contract.save();
      res
        .status(200)
        .json({ success: true, message: "Contract Listed Successfully" });
    } catch (err) {
      console.error("Error creating contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

export default router;
