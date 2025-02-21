import mongoose,{Schema} from "mongoose";
import Counter from "./counter.mjs";
import {cropsArray} from "../utils/crops.mjs"
const marketPlaceSchema = new Schema({
  marketPlaceId:{
    type: Number,
    unique: true,

  },

  buyerId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyerName:{
    type: String,
    required: true,
  },
  buyerProfileImage:{
    type: String,

  },
  buyerProfileLink:{
    type: String,
    required: true,
  },
  productImage:{
    type: String,
    required: true,
  },
  productName:{
    type: String,
    required: true,
    enum : cropsArray
   
  },
  productVariety:{
    type: String,
    required: true,
  },
  additionalInstructions:{
    type: String,
  }
,

  productQuantity:{
    type: String,
    required: true
  },


  
  deadline:{
    type: Date,
    required: true,
  },

  initialPaymentAmount:{
    type: String,
    required: true
  },
  finalPaymentAmount:{
    type: String,
    required: true
  },

  deliveryPreference:{
    type: String,
    enum: ['Buyer', 'Farmer'],
    required: true,
  },

  location: {
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  
},{timestamps:true})

marketPlaceSchema.pre("save", async function (next) {
  const marketPlace = this;

  if (!marketPlace.isNew || marketPlace.marketPlaceId) {
    return next();
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "marketPlaceId" },
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true } 
    );

    if (counter) {
      marketPlace.marketPlaceId = counter.seq; 
    } else {
      throw new Error("Counter document not found or created.");
    }

    next(); 
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err); 
  }
});


export const MarketPlace = mongoose.model("MarketPlace",marketPlaceSchema);