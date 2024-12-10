import { Router } from "express";
import { readFile } from "fs/promises";

import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { BuyerProfile, FarmerProfile } from "../mongoose-models/user-profile.mjs";
import dotenv from "dotenv";
dotenv.config();
const baseAwsUrl = process.env.AWS_S3_URL;
const data = JSON.parse(
  await readFile(
    new URL("../utils/stateDistictsAndCrops.json", import.meta.url)
  )
);






const router = Router();



router.get("/api/price-predictor", authMiddleware, async (req, res) => {
  let state = req.query.state || "";
  let district = req.query.district || "";

  if (state === undefined || state === "") {
    let profile;
    if (req.user.userType === "Farmer") {
       profile = await FarmerProfile.findOne({ userId: req.user.id });
      
    }
    else{
      profile = await BuyerProfile.findOne({ userId: req.user.id });
    }
    
    if (!profile) {
      res
        .status(404)
        .json({ success: false, message: "Please complete your profile." });
    }
    state = profile.address.state;
    district = profile.address.district;

    const stateData = data.states[state];
    if (!stateData) {
      return res
        .status(404)
        .json({
          success: false,
          message: "State not found in the database.",
        });
    }

    let crops = stateData[district];
    if (!crops) {
      return res
        .status(404)
        .json({
          success: false,
          message: "District not found in the state.",
        });
    }

    const cropsWithImages = crops.map(crop => {
      return {
        name: crop,
        imgLink: `${baseAwsUrl}/${crop.split("/").join(" ")}.jpg`,
      };
    });
    

    const dataObj = {
      state: state.split(" ").join("-"),
      district: district.split(" ").join("-"),
      crops:cropsWithImages,
    };

    res.status(200).json({
      success: true,
      message: "Listed Items Found",
      data: dataObj,
      user: {
        name: req.user.userName,
        id: req.user.userId,
        profileImage: req.user.profileImage,
        userType: req.user.userType,
      },
    });
    
  }
  else{
    state = state.split("-").join(" ");
    district = district.split("-").join(" ");
    const stateData = data.states[state];
    if (!stateData) {
      return res
        .status(404)
        .json({
          success: false,
          message: "State not found in the database.",
        });
    }

    const crops = stateData[district];
    if (!crops) {
      return res
        .status(404)
        .json({
          success: false,
          message: "District not found in the state.",
        });
    }
    const cropsWithImages = crops.map(crop => {
      return {
        name: crop,
        imgLink: `${baseAwsUrl}/${crop.split("/").join(" ")}.jpg`,
      };
    });

    const dataObj = {
      state: state.split(" ").join("-"),
      district: district.split(" ").join("-"),
      crops:cropsWithImages,
    };

    res.status(200).json({
      success: true,
      message: "Listed Items Found",
      data: dataObj,
      user: {
        name: req.user.userName,
        id: req.user.userId,
        profileImage: req.user.profileImage,
        userType: req.user.userType,
      },
    });
  }
});

export default router;
