// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC1155Metadata {
    function symbol() external view returns (string memory);

    function name() external view returns (string memory);
}
