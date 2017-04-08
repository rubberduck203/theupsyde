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

---

# Other Stuff

The following things were experiments that aren't actively being used.

## Asp.Net Core Demo Site

Located in the `app/` directory is a boilerplate asp.net core site.
It is currently running on the webserver, but isn't really being used.
More of a proof of concept for a possible future state of the site.

### Asp.Net Core Docker 

*TODO: Hide this behind our firewall like we did for wekan.*

Nginx proxies the /test/ directory to the docker container.
In order for this to work properly, the ASPNETCORE_URLS environment variable must be setup to use the same directory structure.
Otherwise, framework resolved URLs won't generate properly.

https://github.com/aspnet/Hosting/issues/815


```bash
docker run --name aspcoretest -p 8080:80 -d -e "ASPNETCORE_URLS=http://+:80/test" rubberduck/upsyde
```

## NodeJs Todo Webservice

I was originally building this as a way to keep track of things, but it was way simpler to just spin up a Wekan image.
Still, the project in the `api/` directory has been useful as a reference while working on other projects.

TODO: Move the Todo Webservice to it's own repo so it's not cluttering up this one.

### Adding Api Users

If htpasswd isnt' installed already, install it.

```bash
npm install htpasswd -g
```

If no users exist, use the `-c` option to create the new file.

```bash
cd installdir/api/data/
htpasswd -Bcb users.htpasswd username password
```

To delete a user:

```bash
htpasswd -D users.htpasswd username
```

To add a new user

```bash
htpasswd -Bb users.htpasswd username password
```

*The data directory is ignored by git, but it would probably be better to setup an environment variable.*

### Seeding the LokiJs database

The application will throw an exception if you try to query a database that doesn't exist.
You need to seed the database by running the following commands from the node terminal.

Fisrt, start the node terminal by executing the `node` command in the data directory.

```bash
$ cd api/data/
$ node

> var loki = require('lokijs');
> var db = new loki('todo.json');
> db.addCollection('todo');
> var items = db.getCollection('todo');
> items.insert({"title":"fix up the readme"});
> db.save();
```