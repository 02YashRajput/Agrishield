import mongoose,{ Schema } from "mongoose";
import Counter from "./counter.mjs";
const userSchema = new Schema({
  userId: {
    type: Number,
    unique: true,
  },
  userName: {
    type: String,
    required: [true, "Name cannot be empty"],
    trim: true,
    maxLength: 50,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    trim: true,
    unique: [true, "Email must be unique"],
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 
      "Please enter a valid email address",
    ],
  },
  phone:{
    type:String,
    unique:true,
    match: [/^\d{10}$/, "Phone number must be 10 digits long"],
  },
  profileImage: {
    type: String,

  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  userType:{
    type: String,
    required: true,
    enum: ['Farmer', 'Buyer','Admin','Agent'],
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  language : {
    type: String,
    enum: ['en', 'hi','as', 'bn', 'gu', 'kn', 'mai', 'ml', 'mr', 'or', 'pa', 'ta', 'te', 'ur',""],
    default:""
  }
});




userSchema.pre("save", async function (next) {
  const user = this;


  if (!user.isNew || user.userId) {
    return next();
  }

  try {

    const counter = await Counter.findOneAndUpdate(
      { id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } 
    );

    if (counter) {
      user.userId = counter.seq; 
    } else {
      throw new Error("Counter document not found or created.");
    }

    next(); 
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err); 
  }
});


// Export the model
export const User =  mongoose.model('User', userSchema);
