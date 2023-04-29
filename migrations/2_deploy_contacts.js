const paymentSplitter = artifacts.require("./PaymentSplitterContract.sol");
const userAddress = artifacts.require("./UserAddress.sol");
const userContext = artifacts.require("./UserContext.sol");
require('dotenv').config({ path: '../config.env' });

module.exports = async function (deployer)
{
  deployer.deploy(userAddress);
  deployer.deploy(userContext)
  deployer.deploy(paymentSplitter, { from: process.env.BASE_ADDRESS, value: "10000000000000000000" });
};