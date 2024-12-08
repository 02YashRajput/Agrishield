import { Router } from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}



const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const parentDir = path.resolve(__dirname, '../');

router.get("/api/price-predictor", async (req, res) => {
  const state = "UttarPradesh";
  const district = 'Lucknow';
  const commodity = "Wheat";
  const date = formatDate(new Date());

  const pickleFileName = `${state}_crop_price_model_rf_final.pkl`;
  const picklePath = path.resolve(parentDir,'utils','pklFiles',pickleFileName)

  const pythonScriptPath = path.resolve(parentDir,  'scripts', 'load_pkl.py');
  const python = spawn('python3', [
    pythonScriptPath,
    picklePath, 
    "Uttar Pradesh",
    district,
    commodity,
    date
]);

let result = '';
python.stdout.on('data', (data) => {
  result += data.toString();
});

python.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

python.on('close', (code) => {
  if (code === 0) {
      try {
        console.log(result);
          const predictions = JSON.parse(result);
          res.json(predictions);
      } catch (err) {
          res.status(500).json({ error: 'Failed to parse Python script output.' });
      }
  } else {
    console.log(result);
      res.status(500).json({ error: 'Python script exited with an error.' });
  }
});
});

export default router;
