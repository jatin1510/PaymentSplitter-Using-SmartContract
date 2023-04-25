// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract UserContext {
    function msgSenderAddress() internal view virtual returns (address) {
        return msg.sender;
    }

    function msgInformation() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}
