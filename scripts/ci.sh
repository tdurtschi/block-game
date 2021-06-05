#! /bin/bash
set -e

PROJECT_ROOT="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; cd .. ; pwd -P )"

main() {
    cd $PROJECT_ROOT
    yarn build
    yarn test
    yarn e2e:ci
}

main