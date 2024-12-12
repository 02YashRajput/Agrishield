import mongoose, { Schema } from "mongoose";
import Counter from "./counter.mjs";
import {cropsArray} from "../utils/crops.mjs"
const transactionSchema = new Schema({
  transactionId:{
    type: String,
  },
  details:{
    type: String,
    required: true,
  },
  amount:{
    type: Number,
    required: true,
  },
  date:{
    type: Date,
    required: true,
  }
})

const contractSchema = new Schema({
  contractId: {
    type: Number,
    unique: true, 

  },
  marketPlaceId:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "MarketPlace",
    required: true,
    
  },
  contractStatus: {
    type: String,
    enum: ["Requested","Ongoing", "Completed"],
  },
  qualityCheck:{
    type:Boolean,
    required: true,
    default: false,
  },
  quality:{
    type: String,
    
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
  buyerName: {
    type: String,
    required: true,
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  initialpaymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Received"],
    required: true,
  },
  finalpaymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Received"],
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ["Pending", "Delivered","Received",],
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  initialPaymentAmount: {
    type: String,
    required: true,
  },
  finalPaymentAmount:{
    type:String,
    required:true,
  },
  deliveryPreference:{
    type: String,
    enum: ['Buyer', 'Farmer'],
    required: true,
  },
  productName: {
    type: String,
    required: true,
    enum:cropsArray
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
  productQuantity:{
    type: String,
    required: true
  },
  productVariety:{
    type: String,
    required: true,
  },
  transactions: [{
    type: transactionSchema, 
    required: false, 
  }]

},{timestamps: true});





contractSchema.pre("save", async function (next) {
  const contract = this;

  if (!contract.isNew || contract.contractId) {
    return next();
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "contractId" },
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true } 
    );

    if (counter) {
      contract.contractId = counter.seq; 
    } else {
      throw new Error("Counter document not found or created.");
    }

    next(); 
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err); 
  }
});


export const Contract = mongoose.model("Contract", contractSchema);