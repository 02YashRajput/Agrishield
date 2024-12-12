import dotenv from "dotenv";
import { readFile } from "fs/promises";
import {google} from "googleapis"
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { connectDb } from './config/connect-db.mjs';
import fs from "fs";
import { Prediction } from './models/predictions.mjs';
import crypto from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parentDir = path.resolve(__dirname, "../");

const clientId = process.env.DRIVE_CLIENT_ID
const clientSecret = process.env.DRIVE_CLIENT_SECRET
const redirectUrl = "https://developers.google.com/oauthplayground"
const refreshToken = process.env.DRIVE_REFRESH_TOKEN
const data = JSON.parse(
  await readFile(
    new URL("./utils/stateDistictsAndCrops.json", import.meta.url)
  )
);

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUrl
)

oauth2Client.setCredentials({refresh_token: refreshToken})
 


const drive = google.drive({ version: "v3", auth: oauth2Client });

const downloadPklFile = async (fileId, destination) => {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
    drive.files.get(
      { fileId, alt: "media" },
      { responseType: 'stream' },
      (err, response) => {
        if (err) {
          reject('Error fetching the file: ' + err);
          return;
        }

        const dest = fs.createWriteStream(destination);
        response.data.pipe(dest);

        dest.on('finish', () => {
          resolve(`File downloaded to ${destination}`);
        });

        dest.on('error', (err) => {
          reject('Error writing the file: ' + err);
        });
      }
    );
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
  console.log(pythonPath);
  console.log(pythonScriptPath);
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


async function processData(data) {
  for (const [state, districts] of Object.entries(data.states)) {
    if(state !== "Andaman and Nicobar"){
      continue;
    }
    for (const [district, commodities] of Object.entries(districts)) {
      for (const commodity of commodities) {
        await getAndStorePredictions(state,district,commodity);
      }
    }
  }
}

// schedule.scheduleJob('0 0 * * *', processData);

const generatePredictionId = (state, district, commodity) => {
  const hash = crypto.createHash("sha256");
  hash.update(`${state}-${district}-${commodity}`);
  return hash.digest("hex");
};

export const getAndStorePredictions = async (state, district, commodity) => {
  try {
    const predictionId = generatePredictionId(state, district, commodity);

    
    const result = await getPredictions(state, district, commodity);
    console.log("Fetched predictions:", result);


    const existingPredictions = await Prediction.findOne({predictionId})
    if (existingPredictions) {

      await Prediction.findOneAndUpdate(
        { predictionId },
        { $set: { predictions: result } },
        { upsert: true }
      );
      console.log("Updated predictions");
    }

    else{
      const newPrediction = new Prediction({
        predictionId,
        predictions: result,
      });
  
      await newPrediction.save();
      console.log("Prediction stored successfully");
    }
   
    
  } catch (error) {
    console.error("Error in getAndStorePredictions:", error);
    throw error;
  }
};




await connectDb()

await processData(data);




