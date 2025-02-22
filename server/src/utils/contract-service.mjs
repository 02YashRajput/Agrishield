import { deployContract } from "../blockchain/contract-deploy.mjs";

async function createFarmingContract(amount, deadline, farmer, buyer) {
  const unixDeadline = Math.floor(new Date(deadline).getTime() / 1000);
  console.log("Deploying with:", { amount, unixDeadline, farmer, buyer });
  const contractAddress = await deployContract(amount, unixDeadline, farmer, buyer);
  return contractAddress;
}

export { createFarmingContract };
