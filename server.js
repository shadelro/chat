var http = require('http'),
    path = require('path'),
    url = require('url'),
    filesys = require('fs');

server = http.createServer(function(request, response) {
  var requestPath = url.parse(request.url).pathname,
      fullPath = path.join(process.cwd(), 'public', requestPath);

  path.exists(fullPath, function(exists) {
    if (!exists) {
      response.writeHeader(404, {'Content-Type': 'text/plain'});
      response.write('404 Not Found\n');
      response.end();
    } else {
      filesys.readFile(fullPath, 'binary', function(err, file) {
        if (err) {
          response.writeHeader(500, {'Content-Type': 'text/plain'});
          response.write(err + '\n');
          response.end();
        } else {
          response.writeHeader(200);
          response.write(file, 'binary');
          response.end();
        }
      });
    }
  });
});

server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

