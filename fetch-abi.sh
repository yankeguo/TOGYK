#!/bin/bash

set -eu

echo -n 'export const abi = ' >src/abi.ts

curl -SL https://gnosis.blockscout.com/api/v2/smart-contracts/0xc9174F37f7C969e26d91C0A6001c424f1426c6bD | jq .abi >>src/abi.ts

pnpm run format
