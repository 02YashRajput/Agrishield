import mongoose,{Schema} from "mongoose";
import Counter from "./counter.mjs";
const marketPlaceSchema = new Schema({
  marketPlaceId:{
    type: Number,
    unique: true,
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
  productName:{
    type: String,
    required: true,
    enum : [
      'arhar', 'gram', 'masoor', 'rape', 'sunflower',
      'bajra', 'groundnut', 'moong', 'safflower', 'urad',
      'barley', 'jowar', 'niger', 'sesamum', 'wheat',
      'copra', 'jute', 'paddy', 'soyabean',
      'cotton', 'maize', 'ragi', 'sugarcane'
    ]
,    
  },
  additionInstructions:{
    type: String,
    required: true
  }
,

  productQuantity:{
    type: Number,
    required: true
  },

  
  deadline:{
    type: Date,
    required: true,
  },

  initialPaymentAmount:{
    type: Number,
    required: true
  },
  finalPaymentAmount:{
    type: Number,
    required: true
  }
  ,
  successfulContracts:{
    type: Number,
    required: true,
    default: 0
  }
  
})

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