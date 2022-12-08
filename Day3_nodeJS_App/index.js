const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  if (req.url === "/") {
    res.end("<h2>Welcome From Index Page</h2>");
  }
  else if (req.url === "/about") {
    res.end("<h2>Welcome From About Page</h2>");
  } else {
    res.end("<h2>Page not found</h2>");
  }
});

server.listen(3000, () => {
  console.log("Server is listening at port 3000");
})