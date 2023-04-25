// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

library UserAddress {
    // Define function for check given contract address is for valid or not
    function checkContract(address contractAccount) internal view returns (bool){
        return contractAccount.code.length > 0;
    }

    function sendAmount(address payable user, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: Insufficient balance in account");

        (bool success, ) = user.call{value: amount}("");
        require(success, "Address: Can't send amount to user");
    }
}
