import {Router} from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { Contract } from "../mongoose-models/contract.mjs";
const router = Router();


router.get("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const { userType, _id } = req.user; 
    let contracts;

    if (userType === "Farmer") {
      contracts = await Contract.find({ farmerId: _id }).select("contractId transactions");
    } else if (userType === "Buyer") {
      contracts = await Contract.find({ buyerId: _id }).select("contractId transactions");
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    const transactions = contracts.map((contract) => ({
      contractId: contract.contractId,
      transactions: contract.transactions,
      
    }));

    res.status(200).json({
      success: true,
      message:"Transactions found successfully",
      transactions,
      user: {
        name: req.user.userName,
        id: req.user.userId,
        profileImage: req.user.profileImage,
        userType: req.user.userType,
      }
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;