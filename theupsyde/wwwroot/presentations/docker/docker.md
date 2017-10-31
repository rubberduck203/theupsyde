name: title
class: center, middle

# Docker Crash Course

---

layout:true

## Getting Started

---

### A brief explanation of containers

> An image is a lightweight, stand-alone, executable package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and config files.

> A container is a runtime instance of an image—what the image becomes in memory when actually executed. It runs completely isolated from the host environment by default, only accessing host files and ports if configured to do so.

> Containers run apps natively on the host machine’s kernel. They have better performance characteristics than virtual machines that only get virtual access to host resources through a hypervisor. Containers can get native access, each one running in a discrete process, taking no more memory than any other executable.

.footnote[https://docs.docker.com/get-started/#a-brief-explanation-of-containers]

---

### Why Docker?

--

 * Easily Version Controlled

--

 * Standardized Developer Tools

--

 * Fast & Easy to stand up services

--
 
 * Consistent Environments

--

 * Don't deploy *to* an environment, deploy *the* environment

---

### Hello World!

```bash
docker run hello-world
```

.footnote[https://docs.docker.com/get-started/#setup]

--

```bash
# start container and execute bash interactively
docker run -it ubuntu bash

# get current user
whoami

# view release version
cat /etc/lsb-release
```

---

### Running a Service

```bash
docker run --name solr -d -p 8983:8983 -t solr
```

Navigate to http://localhost:8983/solr

.footnote[https://hub.docker.com/_/solr/]

--

 * --name
 * -d (detached)
 * -p (port map)
 * -t (allocate psuedo-tty)
 * solr (image name)

---

### Building an Image

#### Dockerfile

```dockerfile
FROM ubuntu:xenial
RUN apt-get update \
    && apt-get install -y cowsay
```

--

#### Shell

```bash
docker build -t cowsay .
docker run -it cowsay bash
/usr/games/cowsay moo
```

---

### Specifying Commands

#### Dockerfile

```dockerfile
FROM ubuntu:xenial
RUN apt-get update \
    && apt-get install -y cowsay \
    && rm -rf /var/lib/apt/lists/*  
ENTRYPOINT ["/usr/games/cowsay"]
CMD ["moo"]
```

--

#### Shell

```bash
docker build -t cowsay .
docker run cowsay
docker run cowsay hello
docker run -it cowsay bash
docker run -it --entrypoint bash cowsay 
```

---

### Mounting Volumes

#### Create file

```bash
echo "I say moo." > moo.txt
```

--

#### Dockerfile

```dockerfile
FROM ubuntu:xenial
RUN apt-get update \
    && apt-get install -y cowsay \
    && rm -rf /var/lib/apt/lists/*  
WORKDIR /app
VOLUME /app
CMD ["bash"]
```

---

### Mounting Volumes

#### Shell

```bash
docker build -t cowsay .
docker run -it --rm -v $(pwd):/app cowsay
pwd && ls
cat moo.txt | /usr/games/cowsay
```

---

layout:true

## Docker-Compose

---

### ./fortune/index.js

```javascript
const express = require('express')
const app = express()
const quote = require('prog-quote')()

app.get('/', function (req, res) {
    res.send(quote.next().value.quote);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```

### ./fortune/dockerfile

```dockerfile
FROM node
WORKDIR /app
EXPOSE 3000
```

---

### ./cowsay/index.js

```javascript
const express = require('express')
const app = express()
const cowsay = require("cowsay");
const request = require('request');

app.get('/', function (req, res) {
    request('http://fortune:3000', function(error, response, body) {
      let moo = '<pre>' + cowsay.say({text: body}) + '</pre>';
      res.send(moo);
    });
})

app.listen(3080, function () {
  console.log('Example app listening on port 3080!')
})
```

---

### ./cowsay/dockerfile

```dockerfile
FROM node
WORKDIR /app
EXPOSE 3080
```

---

### ./docker-compose.yml

```yaml
version: '3'
services:
  cowsay:
    build: ./cowsay
    image: cowsay
    ports:
      - "3080:3080"
    volumes:
      - ./cowsay:/app
    command: "node index.js"
  fortune:
    build: ./fortune
    image: fortune
    ports:
      - "3000:3000"
    volumes:
      - ./fortune:/app
    command: "node index.js"
```

---

```bash
docker-compose up -d
```

---

layout:true

## Cleaning Up

---

```bash
# remove stopped containers
docker rm $(docker ps --filter "status=exited" -q)
# Remove unused intermediary images
docker rmi $(docker images --filter dangling=true -q)
```