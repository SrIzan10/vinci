#!/bin/bash

# something went wrong function

something_went_wrong () {
    curl \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $($COMMITSTATUS)" \
    https://api.github.com/repos/SrIzan10/vinci/statuses/$(git rev-parse origin/main) \
    -d '{"state":"failure","description":"The build errored!","context":"deployment/rpi"}'
}

# send a pending request thing

curl \
-X POST \
-H "Accept: application/vnd.github+json" \
-H "Authorization: Bearer $($COMMITSTATUS)" \
https://api.github.com/repos/SrIzan10/vinci/statuses/$(git rev-parse origin/main) \
-d '{"state":"pending","description":"Building...","context":"deployment/rpi"}'

{
    git pull

    docker build . -t srizan10/vinci

    docker stop vinci

    docker rm vinci

    docker run -d -t --name vinci -p 7272:7272 --restart unless-stopped srizan10/vinci

        curl \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $($COMMITSTATUS)" \
    https://api.github.com/repos/SrIzan10/vinci/statuses/$(git rev-parse origin/main) \
    -d '{"state":"success","description":"The build errored!","context":"deployment/rpi"}'
} || {
    something_went_wrong()
}