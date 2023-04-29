const CONTACT_ABI = require('../../config.js');
const CONTACT_ADDRESS = require('../../config.js');
const Web3 = require('web3');
require('dotenv').config({ path: '../config.env' });

// Interaction with contract
if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
}
const GAS_LIMIT = process.env.GAS_LIMIT;
const account0 = process.env.ACCOUNT0;
const paymentSplitter = new web3.eth.Contract(CONTACT_ABI.CONTRACT_ABI, CONTACT_ADDRESS.CONTRACT_ADDRESS);

module.exports = { paymentSplitter, account0, GAS_LIMIT };