#!/bin/bash

# login

echo $COMMITSTATUS | gh auth login --with-token

# something went wrong function

something_went_wrong () {
    gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    /repos/SrIzan10/vinci/statuses/$(git rev-parse origin/main) \
    -f state='failure' \
    -f description='The build just errored!' \
    -f context='deployment/rpi'
}

# send a pending request thing

gh api \
--method POST \
-H "Accept: application/vnd.github+json" \
/repos/SrIzan10/vinci/statuses/$(git rev-parse origin/main) \
-f state='pending' \
-f description='The build succeded!' \
-f context='deployment/rpi'

{
    git pull

    docker build . -t srizan10/vinci

    docker stop vinci

    docker rm vinci

    docker run -d -t --name vinci -p 7272:7272 --restart unless-stopped srizan10/vinci

    gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    /repos/SrIzan10/vinci/statuses/$(git rev-parse origin/main) \
    -f state='pending' \
    -f description='The build succeded!' \
    -f context='deployment/rpi'
} || {
    something_went_wrong()
}
    