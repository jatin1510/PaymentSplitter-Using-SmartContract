const paymentSplitter = artifacts.require("./PaymentSplitterContract.sol");
const userAddress = artifacts.require("./UserAddress.sol");
const userContext = artifacts.require("./UserContext.sol");

module.exports = async function (deployer)
{
  deployer.deploy(userAddress);
  deployer.deploy(userContext)
  deployer.deploy(paymentSplitter, { from: "0xc8D8be098265782988af8f43dc7A29BdD43e702E", value: "10000000000000000000" });
};