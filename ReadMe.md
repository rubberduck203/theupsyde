The presentations use Remark.js to render markdown files as slides.

I'm using external markdown, so you'll need a local webserver to serve the markdown files to Remark.

IIS Express Example: 

```bash
cd C:\users\user\program files\iis express\
iisexpress /path C:\path\to\presentations
```

Nginx Docker

```bash
# Create Container
docker run -id --name presentations -p 127.0.0.1:8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx

# Once the container is created, you can just start and stop the container
docker stop presentations
docker start presentations
```

Once running, you can view the presentation by going to `http://localhost:8080/` in the browser.