import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDb = ()=>
mongoose.connect(process.env.dbURL)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Error found while connecting to database', err);
  });