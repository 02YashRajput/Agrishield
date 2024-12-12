import mongoose,{Schema} from "mongoose";
import Counter from "./counter.mjs";
import {cropsArray} from "../utils/crops.mjs"
const negotiationsSchema = new Schema({
  negotiationsId:{
    type: Number,
    unique: true,
  },
  marketPlaceId:{
    type: Schema.Types.ObjectId,
    ref: "MarketPlace",
    required: true,
    unique:true,
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
  productVariety:{
    type: String,
    required: true,
  },
  deliveryPreferenceFarmer:{
    type: String,
    enum: ['Buyer', 'Farmer'],
    required: true,
  },
  deliveryPreferenceBuyer:{
    type: String,
    enum: ['Buyer', 'Farmer'],
    required: true,
  },
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  productName:{
    type: String,
    r2equired: true,
    enum:cropsArray,
  },
 
  productQuantityBuyer:{
    type: String,
    required: true
  },
  deadlineBuyer:{
    type: Date,
    required: true
  },

  initialPaymentAmountBuyer:{
    type: String,
    required: true
  },
  finalPaymentAmountBuyer:{
    type: String,
    required: true
  },
  initialPaymentAmountFarmer:{
    type: String,
    required: true
  },
  finalPaymentAmountFarmer:{
    type: String,
    required: true
  },
  productQuantityFarmer:{
    type: String,
    required: true
  },
  lastUpdated:{
    type:String,
    enum: ['Farmer', 'Buyer'],
    required: true,
  },
  deadlineFarmer:{
    type: Date,
    required: true
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
  farmerProfileImage:{
    type: String,
  },
  farmerProfileLink:{
    type: String,
    required: true,
  },

  
},{timestamps:true})



negotiationsSchema.pre("save", async function (next) {
  const negotiations = this;

  if (!negotiations.isNew || negotiations.negotiationsId) {
    return next();
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "negotiationsId" },
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true } 
    );

    if (counter) {
      negotiations.negotiationsId = counter.seq; 
    } else {
      throw new Error("Counter document not found or created.");
    }

    next(); 
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err); 
  }
});



export const Negotiations = mongoose.model("Negotiations",negotiationsSchema);