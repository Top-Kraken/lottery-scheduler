import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (args, { ethers }) => {
  const [operator] = await ethers.getSigners();

  console.log(`Operator address: ${operator.address}`);
});

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: process.env.OPERATOR_PRIVATE_KEY !== undefined ? [process.env.OPERATOR_PRIVATE_KEY] : [],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: process.env.OPERATOR_PRIVATE_KEY !== undefined ? [process.env.OPERATOR_PRIVATE_KEY] : [],
    },
  },
};

export default config;
