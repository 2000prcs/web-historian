# Web Historian

This project rewrote http://archive.org, a web service that archives sites on the internet. This version allows users to submit a URL, and it'll archive it (by getting a copy of that website off of the internet and writing it to a local text file) and show users the copy.


# Core Application

1. The first will be a web service that serves pages over the web using a RESTful API
- It can accept URLs of sites that the user wants to archive.
- It uses POST requests to save submitted URLS to a single file on your computer.
2. The second will read the list of URLs from that file and fetch the pages specified by those URLs from the internet, saving each web page into a file on your computer.
- Configure this second app to run on a schedule using cron.
