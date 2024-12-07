import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";



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
