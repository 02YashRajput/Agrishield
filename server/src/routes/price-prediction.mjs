import { Router } from "express";
import { readFile } from "fs/promises";
import crypto from "crypto";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import {
  BuyerProfile,
  FarmerProfile,
} from "../mongoose-models/user-profile.mjs";
import dotenv from "dotenv";
import { Prediction } from "../mongoose-models/predictions.mjs";
dotenv.config();
const baseAwsUrl = process.env.AWS_S3_URL;
const data = JSON.parse(
  await readFile(
    new URL("../utils/stateDistictsAndCrops.json", import.meta.url)
  )
);

const generatePredictionId = (state, district, commodity) => {
  const hash = crypto.createHash("sha256");
  hash.update(`${state}-${district}-${commodity}`);
  return hash.digest("hex");
};

const router = Router();

router.get("/api/price-predictor", authMiddleware, async (req, res) => {
  try {
    let state = req.query.state || "";
    let district = req.query.district || "";

    if (state === undefined || state === "") {
      let profile;
      if (req.user.userType === "Farmer") {
        profile = await FarmerProfile.findOne({ userId: req.user.id });
      } else {
        profile = await BuyerProfile.findOne({ userId: req.user.id });
      }

      if (!profile || !profile.address ) {
        return res.status(401).json({ message: "User Profile not found" });
      }

      state = profile.address.state;
      district = profile.address.district;

      const stateData = data.states[state];
      if (!stateData) {
        return res.status(404).json({
          success: false,
          message: "State not found in the database.",
        });
      }

      let crops = stateData[district];
      if (!crops) {
        return res.status(404).json({
          success: false,
          message: "District not found in the state.",
        });
      }

      const cropsWithImages = crops.map((crop) => {
        return {
          name: crop,
          imgLink: `${baseAwsUrl}/${crop.split("/").join(" ")}.jpg`,
        };
      });

      const dataObj = {
        state: state.split(" ").join("-"),
        district: district.split(" ").join("-"),
        crops: cropsWithImages,
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
    } else {
      state = state.split("-").join(" ");
      district = district.split("-").join(" ");
      const stateData = data.states[state];
      if (!stateData) {
        return res.status(404).json({
          success: false,
          message: "State not found in the database.",
        });
      }

      const crops = stateData[district];
      if (!crops) {
        return res.status(404).json({
          success: false,
          message: "District not found in the state.",
        });
      }
      const cropsWithImages = crops.map((crop) => {
        return {
          name: crop,
          imgLink: `${baseAwsUrl}/${crop.split("/").join(" ")}.jpg`,
        };
      });

      const dataObj = {
        state: state.split(" ").join("-"),
        district: district.split(" ").join("-"),
        crops: cropsWithImages,
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
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get(
  "/api/price-predictor/:commodity",
  authMiddleware,
  async (req, res) => {
    try {
      const commodity = decodeURIComponent(req.params.commodity);

      let state = req.query.state || "";
      let district = req.query.district || "";

      if (!state || !district) {
        let profile;
        if (req.user.userType === "Farmer") {
          profile = await FarmerProfile.findOne({ userId: req.user.id });
        } else {
          profile = await BuyerProfile.findOne({ userId: req.user.id });
        }

        if (!profile || !profile.address) {
          return res
            .status(404)
            .json({ success: false, message: "Please complete your profile." });
        }

        state = profile.address.state;
        district = profile.address.district;
      } else {
        state = state.split("-").join(" ");
        district = district.split("-").join(" ");
      }

      const imgLink = `${baseAwsUrl}/${commodity.split("/").join(" ")}.jpg`;
      const predictionId = generatePredictionId(state, district, commodity);
      const prediction = await Prediction.findOne({ predictionId });

      if (!prediction) {
        return res
          .status(404)
          .send({ message: "Prediction Not Found", success: false });
      }

      res.status(200).send({
        message: "Prediction Found",
        success: true,
        data: {
          predictions: prediction.predictions,
          state: state.split(" ").join("-"),
          district: district.split(" ").join("-"),
          imgSrc: imgLink,
        },
        user: {
          name: req.user.userName,
          id: req.user.userId,
          profileImage: req.user.profileImage,
          userType: req.user.userType,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);
export default router;
