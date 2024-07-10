// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./IERC7572.sol";

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

abstract contract ERC7572 is IERC7572, ERC165 {
    string private _contractURI;

    constructor(string memory __contractUri) {
        _setContractURI(__contractUri);
    }

    function contractURI() external view override returns (string memory) {
        return _contractURI;
    }

    function _setContractURI(string memory __contractUri) internal {
        _contractURI = __contractUri;

        emit ContractURIUpdated();
    }

    function _getContractURI() internal view returns (string memory) {
        return _contractURI;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165) returns (bool) {
        return
            interfaceId == type(IERC7572).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
