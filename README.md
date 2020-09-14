# Understanding (or not) fs behaviour in electron.

This repo is deisgned to be a simple example of the strange behaviour of the node fs
module when used in electron.

Basically, it seems that fs.createReadStream is not useable inside the renderer
process to build a FormData object. However, if I use IPC to send the filename
to the main process and do the FormData load and submit from there it works
as expected. (Not shown in this repo)

To see what is going on do the following:

* Open a terminal and run `npm run server`
    - This starts up a simple restify server with a single upload endpoint.

* In a second terminal run `npm run electron:dist`
    - This will start electron with a simple index.html that has a single JS script that does one thing. It tries to create a FormData object and send it to upload using `axios`. In this mode the output in the server log follows. The first block shows the headers - with the content-type set to multipart/form-data and the correct boundary. The second block shows that the restify bodyParser has found - and processed - the uploaded file.

```
***************************
******* req.headers *******
{ accept: 'application/json, text/plain, */*',
  'content-type':
   'multipart/form-data; boundary=--------------------------747733167772394258756897',
  'user-agent': 'axios/0.18.0',
  host: 'localhost:9001',
  connection: 'close',
  'transfer-encoding': 'chunked' }

******* req.files *********
{ file:
   File {
     domain: null,
     _events: {},
     _eventsCount: 0,
     _maxListeners: undefined,
     size: 482,
     path:
      '/var/folders/s9/wjbwm3rd7mq8jgv5cdt17x2m0000gn/T/upload_c56366e75bc9da1b7fcbe4609dbcd2c7',
     name: 'app.js',
     type: 'application/javascript',
     hash: null,
     lastModifiedDate: 2018-07-16T04:16:32.069Z,
     _writeStream:
      WriteStream {
        _writableState: [WritableState],
        writable: false,
        domain: null,
        _events: {},
        _eventsCount: 0,
        _maxListeners: undefined,
        path:
         '/var/folders/s9/wjbwm3rd7mq8jgv5cdt17x2m0000gn/T/upload_c56366e75bc9da1b7fcbe4609dbcd2c7',
        fd: null,
        flags: 'w',
        mode: 438,
        start: undefined,
        autoClose: true,
        pos: undefined,
        bytesWritten: 482,
        closed: false } } }

```

* In a third terminal run `npm run electron:app`
    - This will start electron using a main process script (app.js) which then loads the actual application code (dist/index.html). The output from this follows. Notice the content-type is incorrect and the files object is undefined.

```
***************************
******* req.headers *******
{ host: 'localhost:9001',
  connection: 'keep-alive',
  'content-length': '17',
  accept: 'application/json, text/plain, */*',
  origin: 'file://',
  'user-agent':
   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Electron/2.0.5 Safari/537.36',
  'content-type': 'text/plain;charset=UTF-8',
  'accept-encoding': 'gzip, deflate',
  'accept-language': 'en-GB' }

******* req.files *********
undefined


```
