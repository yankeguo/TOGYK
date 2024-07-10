// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC1155Metadata} from "./IERC1155Metadata.sol";

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract ERC1155Metadata is IERC1155Metadata, ERC165 {
    string private _symbol;
    string private _name;

    constructor(string memory symbol_, string memory name_) {
        _symbol = symbol_;
        _name = name_;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function _getSymbol() internal view returns (string memory) {
        return _symbol;
    }

    function _setSymbol(string memory newSymbol) internal {
        _symbol = newSymbol;
    }

    function _getName() internal view returns (string memory) {
        return _name;
    }

    function _setName(string memory newName) internal {
        _name = newName;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165) returns (bool) {
        return
            interfaceId == type(IERC1155Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
