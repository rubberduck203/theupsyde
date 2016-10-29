Main site runs directly on port 80.
Test version runs on 81.

Lighttpd config is in /etc/lighttpd/lighttpd.conf

After changing the server config, run the following command.

```bash
/etc/init.d/lighttpd restart
```

http://www.cyberciti.biz/faq/stop-lighttpd-server/