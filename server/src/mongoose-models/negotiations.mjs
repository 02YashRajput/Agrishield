import mongoose,{Schema} from "mongoose";
import Counter from "./counter.mjs";

const negotiationsSchema = new Schema({
  negotiationsId:{
    type: Number,
    required: true,
    unique: true,
  },
  marketPlaceId:{
    type: Schema.Types.ObjectId,
    ref: "MarketPlace",
    required: true,
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
    enum:[
      'arhar', 'gram', 'masoor', 'rape', 'sunflower',
      'bajra', 'groundnut', 'moong', 'safflower', 'urad',
      'barley', 'jowar', 'niger', 'sesamum', 'wheat',
      'copra', 'jute', 'paddy', 'soyabean',
      'cotton', 'maize', 'ragi', 'sugarcane'
    ],
  },
 
  productQuantityBuyer:{
    type: Number,
    required: true
  },
  deadlineBuyer:{
    type: Number,
    required: true
  },

  initialPaymentAmountBuyer:{
    type: Number,
    required: true
  },
  finalPaymentAmountBuyer:{
    type: Number,
    required: true
  },
  initialPaymentAmountFarmer:{
    type: Number,
    required: true
  },
  finalPaymentAmountFarmer:{
    type: Number,
    required: true
  },
  productQuantityFarmer:{
    type: Number,
    required: true
  },
  lastUpdated:{
    type:String,
    enum: ['Farmer', 'Buyer'],
    required: true,
  },
  deadlineFarmer:{
    type: Number,
    required: true
  },


  
})



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