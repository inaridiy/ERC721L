// SPDX-License-Identifier: MIT
// Inaridiy ERC721Loanable Contract v1.0.1
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title ERC-721 Non-Fungible Token Standard, optional Loanable extension.
 * @dev If you have questions, go to https://twitter.com/unknown_gakusei.
 */
abstract contract ERC721Loanable is ERC721 {
    // Struct representing lending information
    struct Lending {
        address trueOwner;
        address borrower;
        uint256 tokenId;
        uint256 deadline;
    }

    // Mapping from token ID to Lending infomation.
    mapping(uint256 => Lending) private _tokenIdToLending;

    /**
     * @dev Lend token ID token to `to` for a period of `period`.
     */
    function lend(
        address to,
        uint256 tokenId,
        uint256 period
    ) public virtual {
        require(to != _msgSender(), "ERC721Loanable: Cannot lend to itself.");
        require(
            ownerOf(tokenId) == _msgSender() &&
                _tokenIdToLending[tokenId].borrower != _msgSender(),
            "ERC721Loanable: lend caller is not true owner"
        );
        _tokenIdToLending[tokenId] = Lending(_msgSender(), to, tokenId, period);
        _safeTransfer(_msgSender(), to, tokenId, "");
    }

    /**
     * @dev reclaim token from `borrower` after deadline.
     */
    function reclaim(uint256 tokenId) public {
        Lending memory lending = _tokenIdToLending[tokenId];
        require(
            lending.trueOwner == _msgSender(),
            "ERC721Loanable: reclaim caller is not true owner"
        );
        require(
            lending.deadline < block.timestamp,
            "ERC721Loanable: token is during the lease period"
        );
        _safeTransfer(lending.borrower, lending.trueOwner, tokenId, "");
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting]
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
        require(
            _tokenIdToLending[tokenId].borrower != from,
            "ERC721Loanable: transfer caller is not true owner"
        );
    }
}
