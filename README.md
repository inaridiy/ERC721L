# ERC721Loanable
Extension of ERC721 that allows borrowing and lending NFTs according to contract without trusting the other party.

## Installation
```bash
npm install -save-dev @inaridiy/erc721l
```

## Usage
After installing the contract, you can use it by importing the contract.
```solidity
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
```

## Added Methods
The ERC721L adds three functions to the ERC721 to achieve NFT lending and borrowing.

### lend
Lend an NFT of `tokenId `to an address of `to` for `period` of time.
You can rent out NFTs that you own and have not yet rented out.
The borrower cannot transfer NFT.

```solidity
lend(address to,uint256 tokenId,uint256 period) public;
```

### reclaim
You can get back the NFT of a `tokenId` whose loan period has expired.
You cannot reclaim an NFT that is still in the loan period.

```solidity
reclaim(uint256 tokenId) public;
```

### lendingInfo
Lending information for the NFT of `tokenId` can be obtained.
※If not on loan, all information will be the initial values of Solidity.

```solidity
lendingInfo(uint256 tokenId) public view returns(address owner,address borrower,uint256 deadline)
```

## Local test run.
```bash
git clone git@github.com:inaridiy/ERC721L.git
npm install
npm run hardhat test
```

## License
Distributed under the MIT License. See LICENSE.txt for more information.

## Contact
twitter: https://twitter.com/unknown_gakusei
ens: inaridiy.eth