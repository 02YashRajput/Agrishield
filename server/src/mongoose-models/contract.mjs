import mongoose, { Schema } from "mongoose";
import Counter from "./counter.mjs";
const transactionSchema = new Schema({
  transactionId:{
    type: Number,
    unique: true,
  },
  details:{
    type: String,
    required: true,
  },
  amout:{
    type: String,
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

  productName: {
    type: String,
    required: true,
    enum:[
      'arhar', 'gram', 'masoor', 'rape', 'sunflower',
      'bajra', 'groundnut', 'moong', 'safflower', 'urad',
      'barley', 'jowar', 'niger', 'sesamum', 'wheat',
      'copra', 'jute', 'paddy', 'soyabean',
      'cotton', 'maize', 'ragi', 'sugarcane'
    ]
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
  transactions: [{
    type: transactionSchema, 
    required: false, 
  }]

});


transactionSchema.pre("save",async function (next) {
  const transaction = this;

  if (!transaction.isNew || transaction.transactionId) {
    return next();
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "transactionId" },
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true } 
    );

    if (counter) {
      transaction.transactionId = counter.seq; 
    } else {
      throw new Error("Counter document not found or created.");
    }

    next(); 
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err); 
  }
})



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