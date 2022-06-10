// SPDX-License-Identifier: MIT
// Inaridiy ERC721Loanable Sample Contract v1.0.1
pragma solidity ^0.8.4;

import "./ERC721Loanable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Sample is ERC721Loanable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721Loanable("Sample ERC721Loanable Token", "SET") {}

    function mint() public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);
        _tokenIds.increment();
        return newItemId;
    }
}
