#!/bin/bash

set -m

node webserver.js &

ts-node --transpile-only index.ts

fg %1