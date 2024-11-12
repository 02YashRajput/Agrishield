import { Router } from "express";
import { adminAuthMiddleware } from "../middleware/auth_middleware.mjs";
import { User } from "../mongoose-models/user.mjs";

const router = Router();

router.get("/api/admin/dashboard", adminAuthMiddleware, async (req, res) => {
  try {
   
    const farmerCount = await User.countDocuments({ userType: "Farmer" });
    const buyerCount = await User.countDocuments({ userType: "Buyer" });

   
    res.status(200).json({
      success:true,
      farmersCount: farmerCount,
      buyersCount: buyerCount,
      message: "Dashboard data fetched successfully",
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({success:false, message: 'Error fetching dashboard data' });
  }
});

export default router;
