#!/bin/bash
git pull

docker build . -t srizan10/vinci

docker stop vinci

docker rm vinci

docker run -d -t --name vinci -p 7272:7272 --restart unless-stopped srizan10/vinci