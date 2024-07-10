// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IAccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/IAccessControlDefaultAdminRules.sol";
import {AccessControlDefaultAdminRules} from "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155MetadataURI} from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {IERC7572} from "./IERC7572.sol";
import {ERC7572} from "./ERC7572.sol";
import {ERC1155Metadata} from "./ERC1155Metadata.sol";

contract YGTOG is
    ERC1155Metadata,
    AccessControlDefaultAdminRules,
    ERC7572,
    ERC1155Supply
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor()
        ERC1155Metadata("YGTOG", "Token of Gratitude by Yanke Guo")
        AccessControlDefaultAdminRules(3 days, msg.sender)
        ERC7572("https://nft.yankeguo.com/tokens/YGTOG/metadata.json")
        ERC1155(
            "https://nft.yankeguo.com/tokens/YGTOG/items/{id}/metadata.json"
        )
    {}

    /**
     * set symbol, only admin can call this function
     * @param newSymbol new symbol
     */
    function setSymbol(
        string memory newSymbol
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setSymbol(newSymbol);
    }

    /**
     * set name, only admin can call this function
     * @param newName new name
     */
    function setName(
        string memory newName
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setName(newName);
    }

    /**
     * set token URI, only admin can call this function
     * @param newURI new token URI
     */
    function setURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newURI);
    }

    /**
     * set contract URI, only admin can call this function
     * @param newContractURI new contract URI
     */
    function setContractURI(
        string memory newContractURI
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContractURI(newContractURI);
    }

    /**
     * mint a token, only minter can call this function
     * @param account account to mint to
     * @param id  id of the token
     * @param amount amount of the token
     * @param data data to pass to the receiver if any
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     * @param interfaceId The interface identifier, as specified in ERC-165.
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(
            ERC1155Metadata,
            AccessControlDefaultAdminRules,
            ERC7572,
            ERC1155
        )
        returns (bool)
    {
        return
            ERC1155Metadata.supportsInterface(interfaceId) ||
            AccessControlDefaultAdminRules.supportsInterface(interfaceId) ||
            ERC7572.supportsInterface(interfaceId) ||
            ERC1155.supportsInterface(interfaceId);
    }
}
