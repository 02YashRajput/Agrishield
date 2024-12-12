import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { Negotiations } from "../mongoose-models/negotiations.mjs";
import { validateNegotiationDetails } from "../middleware/validation-models/start-negotiations.mjs";
import { validationResult } from "express-validator";
import { Contract } from "../mongoose-models/contract.mjs";
import { MarketPlace } from "../mongoose-models/market-place.mjs";

const router = Router();

router.get("/api/negotiations", authMiddleware, async (req, res) => {
  try {
    if (req.user.userType === "Farmer") {
      const negotiations = await Negotiations.find({ farmerId: req.user.id });
      res.status(200).json({
        success: true,
        message: "Successfully Found Negotiations",
        data: negotiations,
        user: {
          name: req.user.userName,
          id: req.user.userId,
          profileImage: req.user.profileImage,
          userType: req.user.userType,
        },
      });
    } else {
      const negotiations = await Negotiations.find({ buyerId: req.user.id });
      res.status(200).json({
        success: true,
        message: "Successfully Found Negotiations",
        data: negotiations,
        user: {
          name: req.user.userName,
          id: req.user.userId,
          profileImage: req.user.profileImage,
          userType: req.user.userType,
        },
      });
    }
  } catch (err) {
    console.error("Error requesting contract:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put(
  "/api/negotiations/update/:negotiationsId",
  authMiddleware,
  validateNegotiationDetails,
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation Error",
          errors: errors.array(),
        });
    }


    let { negotiationsId } = req.params;
    if (!negotiationsId) {
      return res
        .status(400)
        .json({ success: false, message: "Negotiations ID is required" });
    }
    negotiationsId = parseInt(negotiationsId, 10);
    const {
      initialPaymentAmount,
      finalPaymentAmount,
      deadline,
      productQuantity,
      deliveryPreference
    } = req.body;

    
    try {
      const negotiation = await Negotiations.findOne({ negotiationsId });
      if (!negotiation) {
        return res.status(404).json({
          success: false,
          message: "Negotiation not found",
        });
      }

      if (req.user.userType === "Farmer") {
        negotiation.initialPaymentAmountFarmer = initialPaymentAmount;
        negotiation.finalPaymentAmountFarmer = finalPaymentAmount;
        negotiation.deadlineFarmer = new Date(deadline);
        negotiation.productQuantityFarmer = productQuantity;
        negotiation.lastUpdated = "Farmer";
        negotiation.deliveryPreferenceFarmer = deliveryPreference;
      } else {
        negotiation.initialPaymentAmountBuyer = initialPaymentAmount;
        negotiation.finalPaymentAmountBuyer = finalPaymentAmount;
        negotiation.deadlineBuyer = deadline;
        negotiation.productQuantityBuyer = productQuantity;
        negotiation.lastUpdated = "Buyer";
        negotiation.deliveryPreferenceBuyer = deliveryPreference;
      }

      await negotiation.save();
      res.status(200).json({
        success: true,
        message: "Negotiation updated successfully",
      });
    } catch (e) {
      console.error("Error requesting contract:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

router.post(
  "/api/negotiations/accept/:negotiationsId",
  authMiddleware,
  async (req, res) => {
    let { negotiationsId } = req.params;
    if (!negotiationsId) {
      return res
        .status(400)
        .json({ success: false, message: "Negotiations ID is required" });
    }
    negotiationsId = parseInt(negotiationsId, 10);

    try {
      const negotiation = await Negotiations.findOne({ negotiationsId });

      const contract = new Contract({
        marketPlaceId: negotiation.marketPlaceId,
        contractStatus: "Ongoing",
        farmerId: negotiation.farmerId,
        productVariety: negotiation.productVariety,
        farmerName: negotiation.farmerName,
        farmerProfileImage: negotiation.farmerProfileImage,
        farmerProfileLink: negotiation.farmerProfileLink,
        productImage: negotiation.productImage,
        productName: negotiation.productName,
        buyerName: negotiation.buyerName,
        buyerId: negotiation.buyerId,
        buyerProfileImage: negotiation.buyerProfileImage,
        buyerProfileLink: negotiation.buyerProfileLink,
        initialPaymentAmount:
          req.user.userType === "Buyer"
            ? negotiation.initialPaymentAmountFarmer
            : negotiation.initialPaymentAmountBuyer,
        finalPaymentAmount:
          req.user.userType === "Buyer"
            ? negotiation.finalPaymentAmountFarmer
            : negotiation.finalPaymentAmountBuyer,
        deadline:
          req.user.userType === "Buyer"
            ? new Date(negotiation.deadlineFarmer)
            : new Date(negotiation.deadlineBuyer),
        productQuantity:
          req.user.userType === "Buyer"
            ? negotiation.productQuantityFarmer
            : negotiation.productQuantityBuyer,
          deliveryPreference:
          req.user.userType === "Buyer"
            ? negotiation.deliveryPreferenceFarmer
            : negotiation.deliveryPreferenceBuyer,
        initialpaymentStatus: "Pending",
        finalpaymentStatus: "Pending",
        deliveryStatus: "Pending",
        qualityCheck: false,
      });
      const savedContract = await contract.save();

      const marketPlace = await MarketPlace.findById(negotiation.marketPlaceId);
      
      const savedQuantity = parseInt(savedContract.productQuantity, 10);
      const marketQuantity = parseInt(marketPlace.productQuantity, 10);
      console.log("saved",savedQuantity);
      console.log("market",marketQuantity);
      if (savedQuantity < marketQuantity) {
        console.log( marketQuantity - savedQuantity);
        const diff = marketQuantity - savedQuantity
        const result =  diff.toString();
        console.log(result);
        marketPlace.productQuantity = result
        
        
        await marketPlace.save();
       await Negotiations.deleteOne({negotiationsId})
      } else {
        

        await Contract.deleteMany({
          marketPlaceId: savedContract.marketPlaceId,
          contractId: { $ne: savedContract.contractId },
        });
        
        await Negotiations.deleteMany({
          marketPlaceId: negotiation.marketPlaceId,
        });
        await MarketPlace.findByIdAndDelete(negotiation.marketPlaceId);
      }
     
      res
        .status(200)
        .json({ success: true, message: `Successfully Started Contract"` });
    } catch (e) {
      console.log("Error requesting contract:", e);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

export default router;
