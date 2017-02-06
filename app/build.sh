#!/bin/bash

# Create an image that has already restored dependencies and published code
docker build -t rubberduck/upsyde:build -f dockerfile.build .
docker create --name upsyde-build rubberduck/upsyde:build

# Copy build artifacts to local file system
mkdir -pv bin/Publish
docker cp upsyde-build:/out/. ./bin/Publish/

# Build lightweight version of container to deploy (no dotnet sdk)
# The package knows to get the file from ./bin/Publish
docker build -t rubberduck/upsyde -f dockerfile.package .

# Clean up container so we can cleanly run again.
docker rm upsyde-build