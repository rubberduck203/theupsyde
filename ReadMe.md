# TheUpsyde.Net

The simplest website that could possibly work.

## License

*All rights reserved.*

All content is my intellectual property, but please feel free to view the repository & source for educational purposes. 

## Deployment

- Copy the contents of `src/` to `//webserver/var/www/htdocs/prod/www.theupsyde.net`
- See below for how to start the wekan docker.

## Server

- The main site runs directly on port 80.
- Nginx config is in `/etc/nginx/conf.d/default.conf`

- After changing the server config, run the following command.

    ```bash
    nginx -s reload
    ```

- Wekan runs off of it's own docker container behind a proxy.

## Presentations

The presentations use Remark.js to render markdown files as slides.
I'm using external markdown, so you'll need a local webserver to serve the markdown files to Remark.

[RemarkJs Wiki](https://github.com/gnab/remark/wiki)

### Nginx Docker

```bash
# Navigate to correct location
cd src

# Create Container
docker run -id --name theupsyde -p 127.0.0.1:8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx

# Once the container is created, you can just start and stop the container
docker stop theupsyde
docker start theupsyde
```

Once running, you can view the presentation by going to `http://localhost:8080/presentations` in the browser.

Press `C` to clone the window and `P` to enter presentation mode.

### MathJax

Some presentations (Lean Estimates) required some mathematical formulas.
You'll need to download [MathJax v2.7](https://github.com/mathjax/MathJax/archive/2.7.0.zip) and extract it into `wwwroot/presentations/mathjax/2.7.0/` or modify the HTML pages to use a cdn.

I'm using a local installation so that this project is not reliant on an internet connection.

TODO: Provide a way to automatically download the package for build/new env setup. 
        A submodule may be a good way to go about this.

## Wekan
### Bringing up wekan

We can't run wekan in a virtual directory because of an issue in FlowRouter, a lib that wekan uses.
https://github.com/wekan/wekan/issues/785
(TODO: Fix the wekan proxy. Issue 785 has been corrected.)

We publish the docker port only on local host, and then proxy to it through nginx & https.

Mac/CentOS 7

```bash
docker network create --driver bridge wekan
docker run --name wekandb -itd --network wekan -v /Users/rubberduck/wekan/data:/data/db mongo
docker run --name wekan -itd --network wekan -p 127.0.0.1:18081:80 -e "MONGO_URL=mongodb://wekandb/wekan" -e "ROOT_URL=https://theupsyde.net:8081" mquandalle/wekan
```

CentOS 6

Uses docker-io instead of docker-engine, so we need to use the old --link networks

```bash
docker run --name wekandb -d -v /var/lib/wekan:/data/db mongo
docker run --name wekan -d --link wekandb -p 127.0.0.1:18081:80 -e "MONGO_URL=mongodb://wekandb/wekan" -e "ROOT_URL=https://theupsyde.net:8081" mquandalle/wekan
```

*Nginx proxies the wekan/ directory to the dockerized app. 

### mongodb

Wekan is backed by a mongodb instance running in the wekandb container.
To access the mongo shell: 

```bash
docker exec -it wekandb mongo
```
