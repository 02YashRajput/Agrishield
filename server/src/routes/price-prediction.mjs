import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import fs from "fs";
import axios from "axios";
import schedule from "node-schedule";
import { authMiddleware } from "../middleware/auth_middleware.mjs";
import { BuyerProfile, FarmerProfile } from "../mongoose-models/user-profile.mjs";
import dotenv from "dotenv";
const baseAwsUrl = process.env.AWS_S3_URL;
const data = JSON.parse(
  await readFile(
    new URL("../utils/stateDistictsAndCrops.json", import.meta.url)
  )
);

const downloadPklFile = async (fileId, destination) => {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(destination);
    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};


export const getPredictions = async (state, district, commodity) => {

  const stateKey = state.toLowerCase().split(" ").join("");

 
  
  const fileId = process.env[stateKey];

  if (!fileId) {
    throw new Error(`No file ID found for state: ${state}`);
  }

 const pickleFileName = `${stateKey}.pkl`;
  const picklePath = path.resolve(
    parentDir,
    "src",
    "utils",
    "pklFiles",
    pickleFileName
  );


  try{
    if (!fs.existsSync(picklePath)) {
      console.log(`Downloading .pkl file for ${state}...`);
      await downloadPklFile(fileId, picklePath);
      console.log(`Downloaded ${pickleFileName}`);
    }else{
      console.log("already downloaded");
    }

  



  const pythonScriptPath = path.resolve(
    parentDir,
    "src",
    "scripts",
    "load_pkl.py"
  );
  const venvPath = path.resolve(parentDir, ".venv");
  const pythonPath = path.resolve(venvPath, "bin", "python");
  const python = spawn(pythonPath, [
    pythonScriptPath,
    picklePath,
    district,
    commodity,
  ]);
  return new Promise((resolve, reject) => {
    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code === 0) {
        try {
          const predictions = JSON.parse(result);
          resolve(predictions);
        } catch (err) {
          console.error("Failed to parse Python script output.", err);
          reject("Failed to parse Python script output.");
        }
      } else {
        console.error(`Python script exited with code: ${code}`);
        reject("Python script exited with an error.");
      }
    });
  });
}catch(err){
  console.log(err);
  return err;
}
};






// async function processData(data) {
//   for (const [state, districts] of Object.entries(data.states)) {
//     for (const [district, commodities] of Object.entries(districts)) {
//       for (const commodity of commodities) {
//         console.log(
//           `State: ${state}, District: ${district}, Commodity: ${commodity}`
//         );
//       }
//     }
//   }
// }

// schedule.scheduleJob('0 0 * * *', processData);

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parentDir = path.resolve(__dirname, "../../");

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
