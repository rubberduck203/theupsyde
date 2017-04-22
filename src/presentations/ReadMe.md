# Summary

This repository contains different presentations that I've given.
All rights reserved.

## Remark

The presentations use Remark.js to render markdown files as slides.
I'm using external markdown, so you'll need a local webserver to serve the markdown files to Remark.

[RemarkJs Wiki](https://github.com/gnab/remark/wiki)

IIS Express Example: 

```bash
cd C:\users\user\program files\iis express\
iisexpress /path C:\path\to\presentations
```

## Nginx Docker

```bash
# Create Container
docker run -id --name presentations -p 127.0.0.1:8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx

# Once the container is created, you can just start and stop the container
docker stop presentations
docker start presentations
```

Once running, you can view the presentation by going to `http://localhost:8080/` in the browser.

Press `C` to clone the window and `P` to enter presentation mode.

## MathJax

Some presentations (Lean Estimates) required some mathematical formulas.
You'll need to download [MathJax v2.7](https://github.com/mathjax/MathJax/archive/2.7.0.zip) and extract it into `/mathjax/2.7.0/` or modify the HTML pages to use a cdn.

I'm using a local installation so that this project is not reliant on an internet connection.