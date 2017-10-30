# TheUpsyde.Net

The simplest website that could possibly work.

## License

*All rights reserved.*

All content is my intellectual property, but please feel free to view the repository & source for educational purposes. 

## Publish

```bash 
git tag x.x.x
git push origin --tags

dotnet publish -c Release theupsyde/theupsyde.fsproj
docker build -t rubberduck/upsyde .
docker tag rubberduck/upsyde rubberduck/upsyde:x.x.x
docker push rubberduck/upsyde
docker push rubberduck/upsyde:x.x.x
```

## Deploy

- ssh into target machine
- pick an empty port and leave the old container running
- Start container

        ```bash
        docker run -p 127.0.0.1:18080:80 -d rubberduck/upsyde:x.x.x
        ```

- Modify the proxy_pass port in `/etc/nginx/conf.d/default.conf` to match the port of the new container, then reload the config.

        ```bash
        sudo nginx -s reload
        ```

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

For rapid development of presentations, use the nginx docker.
For the following to work, the presentation directory requires an `index.html` file.
This should be migrated to the netcore app controller & view prior to shipping.

```bash
# Create Container
docker run -id --name presentations -p 127.0.0.1:8080:80 -v $(pwd)/theupsyde/wwwroot:/usr/share/nginx/html:ro nginx

# Once the container is created, you can just start and stop the container
docker stop presentations
docker start presentations
```

Once running, you can view the presentation by going to `http://localhost:8080/presentations` in the browser.

Press `C` to clone the window and `P` to enter presentation mode.

### MathJax

Some presentations (Lean Estimates) required some mathematical formulas.
You'll need to download [MathJax v2.7](https://github.com/mathjax/MathJax/archive/2.7.0.zip) and extract it into `wwwroot/presentations/mathjax/2.7.0/` or modify the HTML pages to use a cdn.

I'm using a local installation so that this project is not reliant on an internet connection.

TODO: Provide a way to automatically download the package for build/new env setup. 
        A submodule may be a good way to go about this.

## MongoDb

Wekan and Wiki.js are backed by a shared mongodb instance running in the mongodb container.
To access the mongo shell: 

```bash
docker exec -it mongodb mongo
```

### backup

Perform a backup by running the following command and then copying off the contents of /var/lib/mongo/backups to an offsite location.

```bash
docker exec mongodb mongodump --out /var/backups
```

## Wekan
### Bringing up wekan

We publish the docker port only on local host, and then proxy to it through nginx & https.

Mac/CentOS 7

TODO: update Mac/CentOs 7 instructions

```bash
docker network create --driver bridge wekan
docker run --name mongodb -itd --network wekan -v /Users/rubberduck/wekan/data:/data/db mongo
docker run --name wekan -itd --network wekan -p 127.0.0.1:18083:80 -e "MONGO_URL=mongodb://wekandb/wekan" -e "ROOT_URL=https://theupsyde.net/wekan" wekanteam/wekan:v0.24
```

CentOS 6

Uses docker-io instead of docker-engine, so we need to use the old --link networks

```bash
docker run --name mongodb -d -p 127.0.0.1:27017:27017 -v /var/lib/mongo/data/db:/data/db -v /var/lib/mongo/backups:/var/backups mongo
docker run --name wekan -d --link mongodb -p 127.0.0.1:18083:80 -e "MONGO_URL=mongodb://mongodb/wekan" -e "ROOT_URL=https://theupsyde.net/wekan" wekanteam/wekan:v0.24
```

Nginx proxies the wekan/ directory to the dockerized app. 

## Wiki.Js

Wiki.Js runs on port 8082 and is installed in `/opt/wiki`.

```bash
cd /opt/wiki
npm restart #useful after config changes
npm start
npm stop
```

This backing git repository is automatically synced to https://github.com/rubberduck203/opened


