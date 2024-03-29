#!/usr/bin/env bash


scriptDir=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")");

tsx "$scriptDir/src/index.ts" "$@"