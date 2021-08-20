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

run_deploy_from_docker() {
    docker run -it --rm \
        -v $PROJECT_ROOT:$PROJECT_TARGET_DIR \
        -w=$PROJECT_TARGET_DIR \
        --env-file=$PROJECT_ROOT/scripts/deploy.env \
        frolvlad/alpine-bash \
        /bin/bash $PROJECT_TARGET_DIR/scripts/docker/deploy-docker.sh
}

main() {
    cd $PROJECT_ROOT
    
    # Fails if docker daemon not running or currently starting up:
    docker ps -q 
    
    ./scripts/ci.sh

    export_variables_from_file ./scripts/deploy.env
    run_deploy_from_docker
}

main