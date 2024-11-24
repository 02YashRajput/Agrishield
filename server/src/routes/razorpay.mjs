import { Router } from "express";
import Razorpay from "razorpay"
import dotnev from "dotenv"
import { authMiddleware } from "../middleware/auth_middleware.mjs";
dotnev.config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Replace with your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Replace with your Razorpay Key Secret
});
const router = Router()


router.post('/api/create-order',authMiddleware,async (req, res) => {
  const { amount } = req.body;  // Amount in the smallest currency unit (e.g., paise or cents)

  // Options for the Razorpay order
  const options = {
    amount: amount * 100,  // Razorpay expects the amount in paise (smallest currency unit)
    currency: 'INR',  // Currency (e.g., INR for Indian Rupees)
    receipt: `receipt_${Date.now()}`,  // Use the current timestamp to ensure the receipt ID is short
    payment_capture: 1,  // 1 for automatic capture of the payment
  };

  try {
    const order = await razorpay.orders.create(options);

    res.json({success:true,
      message: 'Order created successfully',  
      orderId: order.id,
      
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});



export default router;