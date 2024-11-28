import { Router } from "express";
import { adminAuthMiddleware } from "../middleware/auth_middleware.mjs";
import { User } from "../mongoose-models/user.mjs";
import { Contract } from "../mongoose-models/contract.mjs";
const router = Router();

router.get("/api/admin/dashboard", adminAuthMiddleware, async (req, res) => {
  try {
   
    const farmer = await User.find({ userType: "Farmer" });
    const buyer = await User.find({ userType: "Buyer" });
    const contract = await Contract.find();
   
    res.status(200).json({
      success:true,
      farmers: farmer,
      buyers: buyer,
      contracts:contract,
      message: "Dashboard data fetched successfully",
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({success:false, message: 'Error fetching dashboard data' });
  }
});


router.delete('/api/admin/dashboard/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error });
  }
});

router.delete('/api/admin/dashboard/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndDelete(id);
    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract deleted successfully', deletedContract });
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ message: 'Failed to delete contract', error });
  }
});

export default router;
