import mongoose from "mongoose";

const farmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    required: true,
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
    pinCode:{
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
      type: Number,
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
}, { timestamps: true });



const buyerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
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
    CropsPreferences: [
      {
        type: String,
        enum: [
          'arhar', 'gram', 'masoor', 'rape', 'sunflower',
          'bajra', 'groundnut', 'moong', 'safflower', 'urad',
          'barley', 'jowar', 'niger', 'sesamum', 'wheat',
          'copra', 'jute', 'paddy', 'soyabean',
          'cotton', 'maize', 'ragi', 'sugarcane'
        ],
        
      },
    ]
  },

}, { timestamps: true });

export const farmProfile =  mongoose.model('FarmerProfile', farmerProfileSchema);
export const buyerProfile =  mongoose.model('FarmerProfile', buyerProfileSchema);
