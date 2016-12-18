Main site runs directly on port 80.
Test version runs on 81.

Lighttpd config is in /etc/lighttpd/lighttpd.conf

After changing the server config, run the following command.

```bash
/etc/init.d/lighttpd restart
```

http://www.cyberciti.biz/faq/stop-lighttpd-server/


---

To promote from test to prod

```bash
sudo cp -R /var/www/htdocs/test/www.theupsyde.net /var/www/htdocs/prod
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
````

*The data directory is ignored by git, but it would probably be better to setup an environment variable.*