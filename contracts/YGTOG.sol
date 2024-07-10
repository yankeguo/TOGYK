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

contract YGTOG is AccessControlDefaultAdminRules, ERC1155Supply, ERC7572 {
    string public symbol = "YGTOG";
    string public name = "Token of Gratitude by Yanke Guo";

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor()
        AccessControlDefaultAdminRules(3 days, msg.sender)
        ERC1155(
            "https://nft.yankeguo.com/tokens/YGTOG/items/{id}/metadata.json"
        )
        ERC7572("https://nft.yankeguo.com/tokens/YGTOG/metadata.json")
    {}

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(AccessControlDefaultAdminRules, ERC1155, ERC7572)
        returns (bool)
    {
        return
            AccessControlDefaultAdminRules.supportsInterface(interfaceId) ||
            ERC1155.supportsInterface(interfaceId) ||
            ERC7572.supportsInterface(interfaceId);
    }

    function setURI(string memory newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newURI);
    }

    function setContractURI(
        string memory newContractURI
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContractURI(newContractURI);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }
}
