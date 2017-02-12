Main site runs directly on port 80.

Nginx config is in /etc/nginx/conf.d/default.conf

After changing the server config, run the following command.

```bash
nginx -s reload
```

---

To promote from test to prod

```bash
sudo cp -R /var/www/htdocs/test/www.theupsyde.net /var/www/htdocs/prod
```

## Starting asp.net core docker

Nginx proxies the /test/ directory to the docker container.
In order for this to work properly, the ASPNETCORE_URLS environment variable must be setup to use the same directory structure.
Otherwise, framework resolved URLs won't generate properly.

https://github.com/aspnet/Hosting/issues/815


```bash
docker run --name aspcoretest -p 8080:80 -d -e "ASPNETCORE_URLS=http://+:80/test" rubberduck/upsyde
```

## Adding Api Users

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

## Seeding the database

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