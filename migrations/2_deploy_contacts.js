const paymentSplitter = artifacts.require("./PaymentSplitterContract.sol");
const userAddress = artifacts.require("./UserAddress.sol");
const userContext = artifacts.require("./UserContext.sol");

module.exports = async function (deployer)
{
  deployer.deploy(userAddress);
  deployer.deploy(userContext)
  deployer.deploy(paymentSplitter, { from: "0xeB71B31A3b266525752acb1F214cb59CeC0d76A8", value: "10000000000000000000" });
};