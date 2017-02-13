#!/bin/bash
#docker run -it -p 127.0.0.1:8080:80 --rm -v $(PWD)/app:/app --workdir /app microsoft/aspnetcore-build
docker run -it --rm -v $(PWD)/app:/app --workdir /app microsoft/aspnetcore-build