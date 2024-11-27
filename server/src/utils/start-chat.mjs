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
    await chat.save();
    return true;
  } catch (err) {
    console.error(err); // Optional: Log the error for debugging
    return false;
  }
};