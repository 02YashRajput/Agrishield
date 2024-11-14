import { Router } from "express";
import { authMiddleware } from "../middleware/auth_middleware.mjs";

const router = Router();

router.get('/api/profile',authMiddleware,async (req, res) => {
  res.json({
    success: true,
    message: "User profile",
    user: req.user.name
  });
})

export default router;