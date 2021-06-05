#! /bin/bash
set -e

main() {
    PROJECT_ROOT="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )"
    cd $PROJECT_ROOT

    if [[ `git status --porcelain` ]]; then
        echo "😭 Oh no! It looks like you have uncommitted changes."
        exit 1
    fi
    
    ./scripts/ci.sh
    
    git push
}

main