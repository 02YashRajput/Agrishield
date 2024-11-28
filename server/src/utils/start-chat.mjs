import { Chat } from "../mongoose-models/chat.mjs";
export const createChat = async (participants) => {
  try {
    

    const chat = new Chat({
      participants: participants.map(user => ({
        userId: user.userId,
        name: user.name,
        profileLink: user.profileLink,
      })),
    });
    const savedChat  = await chat.save();
    return savedChat._id;
  } catch (err) {
    console.error("error" ,err); 
    return false;
  }
};