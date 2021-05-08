#! /bin/bash
set -x -e

PROJECT_ROOT="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; cd .. ; pwd -P )"

export_variables_from_file() {
    set -o allexport
    . $1
    set +o allexport
}

run_deploy_from_docker() {
    docker run -it --rm \
        -v $PROJECT_ROOT:$PROJECT_TARGET_DIR \
        -w=$PROJECT_TARGET_DIR \
        --env-file=$PROJECT_ROOT/deployment/deploy.env \
        frolvlad/alpine-bash \
        /bin/bash $PROJECT_TARGET_DIR/deployment/deploy-docker.sh
}

main() {
    cd $PROJECT_ROOT
    yarn build
    yarn test
    yarn e2e:ci
    export_variables_from_file ./deployment/deploy.env

    run_deploy_from_docker
}

main