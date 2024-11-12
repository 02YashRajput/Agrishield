import mongoose from 'mongoose';

// Message schema
const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Chat schema
const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: String }, 
    lastUpdated: { type: Date, default: Date.now }
});

// Create models
const Message = mongoose.model('Message', messageSchema);
const Chat = mongoose.model('Chat', chatSchema);

export { Chat, Message };
