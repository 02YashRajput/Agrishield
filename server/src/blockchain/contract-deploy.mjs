import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();


const RPC_URL = process.env.RPC_URL; 
const PRIVATE_KEY = process.env.PRIVATE_KEY; 

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


const CONTRACT_PATH = "src/blockchain/out/FarmingContract.sol/FarmingContract.json";
const contractJson = JSON.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));

async function deployContract(amount, deadline, farmer, buyer) {
    const factory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);
    const contract = await factory.deploy(amount, deadline, farmer, buyer);
    await contract.waitForDeployment();
    console.log("Contract deployed at:", contract.target);
    return contract.target;
}

export { deployContract };
