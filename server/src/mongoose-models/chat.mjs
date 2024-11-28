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

chatSchema.pre('save', async function (next) {
    if (this.participants.length !== 2) {
        return next(new Error('A chat must have exactly two participants.'));
    }

    const Chat = mongoose.model('Chat');
    const participantIds = this.participants.map(participant => participant.userId.toString());

    // Check for an existing chat with exactly these two participants
    const existingChat = await Chat.findOne({
        $and: [
            { 'participants.userId': { $all: participantIds } }, // Both userIds are present
           
        ],
    });

    if (existingChat) {
        return next(new Error('A chat between these participants already exists.'));
    }

    next();
});


const Message = mongoose.model('Message', messageSchema);
const Chat = mongoose.model('Chat', chatSchema);

export { Chat, Message };
