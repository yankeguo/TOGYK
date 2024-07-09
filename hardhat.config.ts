import "@nomicfoundation/hardhat-ethers";
import "@yankeguo/hardhat-trezor";
import "@nomicfoundation/hardhat-verify";

import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import { ethers } from "ethers";

task("yktoa_deploy", "deploy YKTOA", async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners();
  const balance = await signer.provider.getBalance(signer.address);
  console.log("address:", signer.address);
  console.log("balance:", ethers.formatEther(balance));
  console.log("deploying contract...");
  const YKTOA = await hre.ethers.getContractFactory("YKTOAContract");
  const contract = await YKTOA.deploy();
  console.log("contract deployed at:", await contract.getAddress());
});

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    gnosis: {
      url: "https://rpc.gnosischain.com",
      trezorDerivationPaths: [[44, 60, 0, 0, 0]],
      trezorInsecureDerivation: true,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      trezorDerivationPaths: [[44, 60, 0, 0, 0]],
      trezorInsecureDerivation: true,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
        },
      },
    ],
    apiKey: {
      chiado: "",
      gnosis: process.env.GNOSISSCAN_API_KEY,
    },
  },
} as HardhatUserConfig;
