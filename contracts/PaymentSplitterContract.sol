// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./userContext.sol";
import "./userAddress.sol";

contract PaymentSplitterContract is UserContext {
    /* 
        Step - 1
        Define some important variables 
    */
    // Define total amount involved in Payment-Splitter
    uint128 totalShareAmount;

    // Define total payment done using Payment-Splitter
    uint128 totalPaid;

    // Define companyShare map for mapping address to uint128 (for every company account address map to some share )
    mapping(address => uint128) companyShare;

    // Define companyReceivedAmount for find payment received by company (initially it is 0)
    mapping(address => uint128) companyReceivedAmount;

    // Define array for store all company address
    address[] private companies;

    /* 
        Step - 2 
        Define functions and event for add company in contract 
    */
    // Define event for add company
    event CompanyAdded(address account, uint128 share);

    // Define function for add company which are involved with our contract
    function addCompany(address accountAddress, uint128 shareAmount) public {
        require(
            accountAddress != address(0),
            "PaymentSplitterContract : Please enter non zero address."
        );
        require(
            shareAmount > 0,
            "PaymentSplitterContract :  Please enter positive share amount"
        );

        companyShare[accountAddress] = shareAmount;
        companies.push(accountAddress);
        totalShareAmount += shareAmount;
        emit CompanyAdded(accountAddress, shareAmount);
    }

    // // Define constructor for contract
    constructor() public payable {
        totalShareAmount = 0;
        totalPaid = 0;
    }

    /* 
        Step - 3
        Define functions for send payment to company 
    */
    // Define function for find total paid amount by this contract
    function totalPaidAmount() public view returns (uint128) {
        return totalPaid;
    }

    // Define function for find amount already received by company
    function alreadyReceived(
        address companyAddress
    ) public view returns (uint128) {
        return companyReceivedAmount[companyAddress];
    }

    // Define function for find total amount company can get
    function payableAmount(
        address companyAccount
    ) public view returns (uint128) {
        return companyShare[companyAccount];
    }

    // Define event for send payment
    event PaymentSend(address company, uint128 sendAmount);
    event PaymentAlreadyDone(address companyAccount, string mes);

    // Define function for send amount to company
    function sendCompanyAmount(address payable companyAccount) public virtual {
        uint128 possiblePayment = payableAmount(companyAccount);

        if (possiblePayment == 0) {
            emit PaymentAlreadyDone(companyAccount, "Payment already done");
            return;
        }

        totalPaid += possiblePayment;
        unchecked {
            companyReceivedAmount[companyAccount] += possiblePayment;
        }

        UserAddress.sendAmount(companyAccount, possiblePayment);
        // removeElement(companyAccount);
        emit PaymentSend(companyAccount, possiblePayment);
    }

    // Define event for user received amount
    event PaymentGet(address from, uint128 amount);

    // Define function for show event when user receive amount
    receive() external payable virtual {
        emit PaymentGet(msgSenderAddress(), uint128(msg.value));
    }

    // Define function for find total shares of companies
    function totalShareAmounts() public view returns (uint128) {
        return totalShareAmount;
    }

    /* 
        Step - 3
        Define event and function for final payment to all companies 
    */
    // Define event for payment done to all companies
    event PaymentDone(string str);

    // Define function for send amount to all companies
    function payAll() public {
        for (uint128 i = 0; i < companies.length; i++) {
            sendCompanyAmount(payable(companies[i]));
        }
        emit PaymentDone("Payment to all companies done.");
    }

    /*

        Step-4
        Define function to remove company from contract

    */

    function removeElement(address _element) public {
        for (uint256 i; i < companies.length; i++) {
            if (companies[i] == _element) {
                companies[i] = companies[companies.length - 1];
                companies.pop();
                totalShareAmount -= companyShare[_element];
                companyShare[_element] = 0;
                companyReceivedAmount[_element] = 0;
                break;
            }
        }
    }
}
