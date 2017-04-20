# TheUpsyde.Net

The simplest website that could possibly work.

## Building

The website includes presentations from https://github.com/rubberduck203/Presentations.
This was a pre-existing repository, so it's been included as a submodule.

The site is now build by running `npm run build`, which will drop the prepared website into the `dist/` directory.

## Deployment

- Copy the contents of `dist/` to `//webserver/var/www/htdocs/prod/www.theupsyde.net`
- See below for how to start the wekan docker.

## Server

- The main site runs directly on port 80.
- Nginx config is in `/etc/nginx/conf.d/default.conf`

- After changing the server config, run the following command.

    ```bash
    nginx -s reload
    ```

- Wekan runs off of it's own docker container behind a proxy.

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
