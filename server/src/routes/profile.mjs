import { Router } from "express";
import { authMiddlewware } from "../middleware/auth_middleware.mjs";

const router = Router();

router.get('/api/profile',authMiddlewware,async (req, res) => {
  res.json({
    success: true,
    message: "User profile",
    user: req.user.name
  });
})

export default router;