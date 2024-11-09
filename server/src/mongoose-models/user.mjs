import mongoose,{ Schema } from "mongoose";

const userSchema = new Schema({
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
    type:Number,
    
    unique:true,
    match: [/^\d{10}$/, "Phone number must be 10 digits long"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  userType:{
    type: String,
    required: true,
    enum: ['Farmer', 'Buyer'],
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },

});

// Export the model
export const User =  mongoose.model('User', userSchema);
