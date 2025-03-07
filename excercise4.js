const http= require('http');
const URL = require('url').URL;
const items = ['cherry', 'kiwi', 'apple'];
http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const parameters = url.searchParams;
    const selectedItem = parameters.get('itemNum');
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end(`Here is your data: ${items[selectedItem]}`);
}).listen(8081);