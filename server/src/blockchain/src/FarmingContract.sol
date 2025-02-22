// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmingContract {
    enum Status { Ongoing, Completed }
    
    uint256 public amount;
    uint256 public deadline;
    Status public status;
    string public farmer; 
    string public buyer;   

    event StatusUpdated(Status newStatus);

    constructor(uint256 _amount, uint256 _deadline, string memory _farmer, string memory _buyer) {
        amount = _amount;
        deadline = _deadline;
        farmer = _farmer;
        buyer = _buyer;
        status = Status.Ongoing;
    }

    function updateStatus(Status _status) public {
        status = _status;
        emit StatusUpdated(_status);
    }
}
