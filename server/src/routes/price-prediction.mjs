import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const mockData = 
  {
    "states": [
      {
        "stateName": "State A",
        "districts": [
          {
            "districtName": "District 1",
            "crops": [
              {
                "cropName": "Wheat",
                "predictedPrices": [200, 210, 215, 220, 230, 240, 250, 245, 240, 235, 230, 225]
              },
              {
                "cropName": "Rice",
                "predictedPrices": [150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205]
              }
            ]
          },
          {
            "districtName": "District 2",
            "crops": [
              {
                "cropName": "Maize",
                "predictedPrices": [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175]
              },
              {
                "cropName": "Barley",
                "predictedPrices": [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155]
              }
            ]
          }
        ]
      },
      {
        "stateName": "State B",
        "districts": [
          {
            "districtName": "District 3",
            "crops": [
              {
                "cropName": "Sugarcane",
                "predictedPrices": [300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355]
              },
              {
                "cropName": "Cotton",
                "predictedPrices": [250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305]
              }
            ]
          },
          {
            "districtName": "District 4",
            "crops": [
              {
                "cropName": "Soybean",
                "predictedPrices": [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275]
              },
              {
                "cropName": "Groundnut",
                "predictedPrices": [180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235]
              }
            ]
          }
        ]
      }
    ]
  }


const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const parentDir = path.resolve(__dirname, '../');

router.get("/api/price-predictor", async (req, res) => {
  const state = "UttarPradesh";
  const district = 'Lucknow';
  const commodity = "Wheat";


  const pickleFileName = `${state}_crop_price_model_rf_final.pkl`;
  const picklePath = path.resolve(parentDir,'utils','pklFiles',pickleFileName)

  const pythonScriptPath = path.resolve(parentDir,  'scripts', 'load_pkl.py');
  const python = spawn('python3', [
    pythonScriptPath,
    picklePath,
    "Uttar Pradesh",
    district,
    commodity,
    new Date().toLocaleDateString(),
  ]);

  let output = '';
  python.stdout.on('data', (data) => {
    output += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  python.on('close', (code) => {
    if (code === 0) {
      res.json({ success: true, result: output.trim() });
    } else {
      res.status(500).json({ error: `Failed to process data for commodity: ${commodity}` });
    }
  });
});

export default router;
