The presentations use Remark.js to render markdown files as slides.

I'm using external markdown, so you'll need a local webserver to serve the markdown files to Remark.

IIS Express Example: 

```bash
cd C:\users\user\program files\iis express\
iisexpress /path C:\path\to\presentations
```

Once running, you can view the presentation by going to `http://localhost:8080/` in the browser.