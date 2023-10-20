// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {StringToAddress, AddressToString} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/utils/AddressString.sol";

contract ReceiveRandom is AxelarExecutable {
    using StringToAddress for string;
    using AddressToString for address;

    IAxelarGasService public immutable gasService;
    string public chainName; // name of the chain this contract is deployed to

    struct Random {
        bytes random;
    }

   Random public storedRandom; // message received from _execute

    constructor(
        address gateway_,
        address gasReceiver_,
        string memory chainName_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
        chainName = chainName_;
    }

    function _execute(
        string calldata /*sourceChain*/,
        string calldata /*sourceAddress*/,
        bytes calldata payload
    ) internal override {      
        ( bytes memory random) = abi.decode(payload, ( bytes));
        storedRandom = Random(random);
    }
}