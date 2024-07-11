#!/bin/bash

set -eu

pnpm version --no-commit-hooks --no-git-tag-version "0.$(date '+%Y%m%d%H%M%S').0"
