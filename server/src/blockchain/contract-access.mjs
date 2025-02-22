import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Read contract ABI
const CONTRACT_PATH = "src/blockchain/out/FarmingContract.sol/FarmingContract.json";
const contractJson = JSON.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));

async function getContract(contractAddress) {
    return new ethers.Contract(contractAddress, contractJson.abi, provider);
}


export { getFarmer, getBuyer, getStatus };
