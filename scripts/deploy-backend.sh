#! /bin/bash
set -e

PROJECT_ROOT="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; cd .. ; pwd -P )"

export_variables_from_file() {
    if [ ! -f $PROJECT_ROOT/scripts/deploy.env ]; then
        echo "😭 ERROR!"
        echo "🔴 File 'deploy.env' does not exist in directory $PROJECT_ROOT/scripts"
        echo ""
        exit 1
    fi

    set -o allexport
    . $1
    set +o allexport
}

main() {
    cd $PROJECT_ROOT
    export_variables_from_file ./scripts/deploy.env

    cd src/server-remote
    npm run compile-ts

    az webapp up --sku F1 --name $BACKEND_AZURE_APP_NAME
}

main