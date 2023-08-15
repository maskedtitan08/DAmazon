require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:'./.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    hardhat:{},
    polygonMumbai:{
      url:process.env.RPC_URL,
      accounts:[process.env.PRIVATE_KEY],
    },
  },

  paths:{
    artifacts : "./client/src/artifacts",
  },
};
