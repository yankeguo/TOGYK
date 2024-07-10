import "@nomicfoundation/hardhat-ethers";
import "@yankeguo/hardhat-trezor";
import "@nomicfoundation/hardhat-verify";

import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import { ethers } from "ethers";

task("ygtog:deploy", "deploy YGTOG contract", async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners();
  const balance = await signer.provider.getBalance(signer.address);
  console.log("address:", signer.address);
  console.log("balance:", ethers.formatEther(balance));
  console.log("deploying contract...");
  const YGTOG = await hre.ethers.getContractFactory("YGTOG", signer);
  const contract = await YGTOG.deploy();
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
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://gnosis-chiado.blockscout.com/",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://gnosis.blockscout.com/api",
          browserURL: "https://gnosis.blockscout.com/",
          //apiURL: "https://api.gnosisscan.io/api",
          //browserURL: "https://gnosisscan.io/",
        },
      },
    ],
    apiKey: {
      chiado: process.env.BLOCKSCOUT_CHIADO_API_KEY,
      gnosis: process.env.BLOCKSCOUT_GNOSIS_API_KEY,
      //gnosis: process.env.ETHERSCAN_GNOSIS_API_KEY,
    },
  },
} as HardhatUserConfig;
