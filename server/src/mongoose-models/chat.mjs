import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            profileLink: { type: String, required: true },
        },
    ],
    lastMessage: { type: String },
    lastUpdated: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
const Chat = mongoose.model('Chat', chatSchema);

export { Chat, Message };
