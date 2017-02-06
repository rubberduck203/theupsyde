#!/bin/bash
docker build -t rubberduck/upsyde:build -f dockerfile.build .
#todo: create build container and cp its output from bin/Release/netcoreapp1.1/publish/ 
# to someplace convenient for package to pick it up.
# This only worked the first time because I mounted the :build image
docker build -t rubberduck/upsyde -f dockerfile.package .