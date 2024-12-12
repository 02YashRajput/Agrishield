// config/socket.mjs
import { Server } from 'socket.io';
import { Message } from '../mongoose-models/chat.mjs'; 
import { Chat } from '../mongoose-models/chat.mjs'; 
import dotenv from 'dotenv';
dotenv.config();
export const configureChatSockets = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173","https://agrishield.vercel.app"], 
            credentials: true,
        },
    });

    
    io.on('connect', (socket) => {

        socket.on('joinChat', ({ chatId }) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', async ({ chatId, senderId, content }) => {
            try {
                const message = await Message.create({ chatId, senderId, content });

                await Chat.findByIdAndUpdate(chatId, {
                    lastMessage: content,
                    lastUpdated: new Date(),
                });

                io.to(chatId).emit('newMessage', message);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });


    });
};