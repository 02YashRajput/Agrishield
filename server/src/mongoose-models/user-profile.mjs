import mongoose from "mongoose";

const farmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
  },

  address: {
    name:{
      type: String,
      required: true,
    },
    district:{
      type: String,
      required: true,
    },
    state:{
      type: String,
      required: true,
    },
    pincode:{
      type:String,
      required: true,
      match: /^[0-9]{6}$/,
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
   
  },
  paymentInformation: {
    bankDetails: {
      accountNumber: {
        type: Number,
        required: true,
        match: /^[0-9]{9,18}$/, 
      },
      accountHolderName: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      IFSCCode: {
        type: String,
        required: true,
        match: /^[A-Z]{4}0[A-Z0-9]{6}$/, // Example validation for IFSC code format
      },
    },
    upiDetails: {
      upiId: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/, 
      },
      upiName: {
        type: String,
      },
    },
  },
  farmDetails: {
    farmAddress: {
      type: String,
      required:true,
    },
    farmSize: {
      type: String,
      required: true,
    },
    sizeUnit: {
      type: String,
      required: true,
      enum: ['Bigha','Acres', 'Hectares','Gunta'],
    },
    cropsGrown: [
      {
        type: String,
        required:true,
        enum:[
          'arhar', 'gram', 'masoor', 'rape', 'sunflower',
          'bajra', 'groundnut', 'moong', 'safflower', 'urad',
          'barley', 'jowar', 'niger', 'sesamum', 'wheat',
          'copra', 'jute', 'paddy', 'soyabean',
          'cotton', 'maize', 'ragi', 'sugarcane'
        ],
        
      },
    ],
    
  },
  notificationPreferences: {
    message:{
      type: Boolean,
      default: false,
    },
    email:{
      type: Boolean,
      default: false,
    }
  },
  reviews :{
    type:[String],

  },
  rating:{
    type: Number,
    default: 0,
  }
}, { timestamps: true });



const buyerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
  },

  address: {
    name:{
      type: String,
      required: true,
    },
    district:{
      type: String,
      required: true,
    },
    state:{
      type: String,
      required: true,
    },
    pincode:{
      type:String,
      required: true,
      match: /^[0-9]{6}$/,
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
   
  },
  paymentInformation: {
    bankDetails: {
      accountNumber: {
        type: String,
        required: true,
        match: /^[0-9]{9,18}$/, 
      },
      accountHolderName: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      IFSCCode: {
        type: String,
        required: true,
        match: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      },
    },
    upiDetails: {
      upiId: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/, 
      },
      upiName: {
        type: String,
      },
    }
   
  },
  notificationPreferences: {
    message:{
      type: Boolean,
      default: false,
    },
    email:{
      type: Boolean,
      default: false,
    }
  },  
  
  reviews :{
    type:[String],
  },
  rating:{
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export const FarmerProfile =  mongoose.model('FarmerProfile', farmerProfileSchema);
export const BuyerProfile =  mongoose.model('BuyerProfile', buyerProfileSchema);
