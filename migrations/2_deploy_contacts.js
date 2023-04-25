const paymentSplitter = artifacts.require("./PaymentSplitterContract.sol");
const userAddress = artifacts.require("./UserAddress.sol");
const userContext = artifacts.require("./UserContext.sol");

module.exports = async function (deployer)
{
  deployer.deploy(userAddress);
  deployer.deploy(userContext)
  deployer.deploy(paymentSplitter, { from: "0x169E740a1F8d11AfE14E667DFdfc56aABAcF3678", value: "10000000000000000000" });
};