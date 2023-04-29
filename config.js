require('dotenv').config({ path: 'config.env' });


const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

const CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor",
      "payable": true
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "share",
          "type": "uint128"
        }
      ],
      "name": "CompanyAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "companyAccount",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "mes",
          "type": "string"
        }
      ],
      "name": "PaymentAlreadyDone",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "str",
          "type": "string"
        }
      ],
      "name": "PaymentDone",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "PaymentGet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "company",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "sendAmount",
          "type": "uint128"
        }
      ],
      "name": "PaymentSend",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "accountAddress",
          "type": "address"
        },
        {
          "internalType": "uint128",
          "name": "shareAmount",
          "type": "uint128"
        }
      ],
      "name": "addCompany",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalPaidAmount",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "companyAddress",
          "type": "address"
        }
      ],
      "name": "alreadyReceived",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "companyAccount",
          "type": "address"
        }
      ],
      "name": "payableAmount",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "companyAccount",
          "type": "address"
        }
      ],
      "name": "sendCompanyAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalShareAmounts",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "payAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_element",
          "type": "address"
        }
      ],
      "name": "removeElement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

module.exports = {
    CONTRACT_ABI,
    CONTRACT_ADDRESS,
};
