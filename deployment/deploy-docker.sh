#! /bin/bash

set -e

install_dependencies() {
    apk add --no-cache ncftp
}

do_static_upload() {
    ncftpput -R -v -u $FTP_USER -p $FTP_PASS $FTP_URL $FTP_TARGET_DIRECTORY $STATIC_CONTENT_ROOT/*
}

main() {
    install_dependencies
    do_static_upload

    echo "Success!"
}

main
