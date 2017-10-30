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
 * -d (daemon)
 * -p (port map)
 * -t (tty)
 * solr (image name)