import mongoose, { Schema } from "mongoose";

const predictionSchema = new Schema({
  predictionId:{
    type: String,
    required: true,
    unique: true,
  },
  predictions: {
    type: [Number], // An array of floating-point numbers
    required: true, // Makes the field mandatory
    validate: [
      {
        validator: function (arr) {
          return arr.length === 12; // Ensures the array has exactly 12 elements
        },
        message: 'Predictions array must contain exactly 12 elements.',
      },
      {
        validator: function (arr) {
          return arr.every((num) => typeof num === 'number'); // Ensures all elements are numbers
        },
        message: 'Predictions array must only contain numbers.',
      },
    ],
  },
})

export const Prediction = mongoose.model("Prediction", predictionSchema);