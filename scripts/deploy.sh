#! /bin/bash
set -e

PROJECT_ROOT="$( cd "$(dirname "${BASH_SOURCE[0]}")" ; cd .. ; pwd -P )"

export_variables_from_file() {
    if [ ! -f $1 ]; then
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
        --env-file=$1 \
        frolvlad/alpine-bash \
        /bin/bash $PROJECT_TARGET_DIR/scripts/docker/do-static-upload.sh
}

docker_running_guard() {
    # Fails if docker daemon not running or currently starting up:
    docker ps -q 
}

publish_docker_image() {
    echo ""
    echo "🔧 Building docker image..."
    docker build -f scripts/docker/Dockerfile -t tdurtschi/block-game-client .
    
    # Example to run this container: 
    # docker run -p 80:80 -it --rm tdurtschi/block-game-client
    echo ""
    echo "🚀 Pushing image tdurtschi/block-game-client:latest..."
    docker push tdurtschi/block-game-client:latest
}

main() {
    cd $PROJECT_ROOT
    docker_running_guard
    export_variables_from_file ./scripts/deploy.env

    ./scripts/ci.sh

    run_deploy_from_docker ./scripts/deploy.env
    # publish_docker_image
}

main