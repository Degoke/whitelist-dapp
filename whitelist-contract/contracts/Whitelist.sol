//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public maxWhiteListedAddresses;

    mapping(address => bool) public whiteListedAddresses;

    uint8 public numWhitelistedAddresses;

    constructor(uint8 _maxWhiteListedAddresses) {
        maxWhiteListedAddresses = _maxWhiteListedAddresses;
    }

    function addAddressToWhiteList() public {
        require(!whiteListedAddresses[msg.sender], "Sender has already been whitelisted");

        require(numWhitelistedAddresses < maxWhiteListedAddresses, "more addresses cant be added, limit reached");

        whiteListedAddresses[msg.sender] = true;

        numWhitelistedAddresses += 1;
    }
}