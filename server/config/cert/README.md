# ExpressJS HTTPS

## How to set up a HTTPS Express.js Server

Setting up a HTTPS Express.js server is pretty easy and straightforward. First you need to make sure you have a signed SSL certificate for your server. In case you don't have one, you can create one for yourself this way:

```sh
$ openssl genrsa -out privatekey.pem 1024
$ openssl req -new -key privatekey.pem -out certrequest.csr
$ openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

That creates a self-signed SSL certificate. Good for testing locally, but not recommended on a production server. Get a SSL certificate for your website from a reputed Certificate Authority.

The next step is similar to calling the regular `createServer()` method of HTTP server. Except, in this case we load the key and certificate and pass them to the `createServer()` methods in an object:

```html
var fs = require('fs');
var privateKey = fs.readFileSync(__dirname + '/config/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(__dirname + '/config/cert/certificate.pem').toString();
var credentials = {key: privateKey, cert: certificate};

var app = require('express').createServer(credentials);
```