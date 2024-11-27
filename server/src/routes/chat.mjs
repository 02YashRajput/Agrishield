import {Router} from "express"
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { Chat,Message } from "../mongoose-models/chat.mjs";
import { Server } from 'socket.io';
const router = Router();


router.get("/api/chat" , authMiddleware,async(req,res)=>{
  try{

    const chats = await Chat.find({'participants.userId': req.user.id}).sort({ lastUpdated: -1 });
    res.status(200).json({success: true, message: "Chats fetched successfully", data: chats,user:req.user.id});    

  }catch(e){
    console.log(e);
    res.status(500).json({success: false, message: "Server error"});
  }
})


router.get("/api/chat/:chatId", authMiddleware,async(req,res)=>{
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId })
        .sort({ timestamp: 1 }); 

    res.status(200).json({success: true, message: "Chats fetched successfully", data: messages });
} catch (error) {
    res.status(500).json({ success: false,message: 'Server Error' });
}
})



export default router