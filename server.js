const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple UI to enter target URLs
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Unblocked Proxy</title></head>
      <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
        <h2>Enter a website URL</h2>
        <form action="/browse" method="get">
          <input type="text" name="url" placeholder="https://example.com" style="width:300px; padding:10px;">
          <button type="submit" style="padding:10px 15px;">Go</button>
        </form>
      </body>
    </html>
  `);
});

// Proxy forwarder
app.use('/browse', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.send("Please enter a URL.");
  
  let targetHost;
  try {
    targetHost = new URL(targetUrl).origin;
  } catch (e) {
    return res.send("Invalid URL. Make sure to include http:// or https://");
  }

  return proxy(targetHost)(req, res, next);
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
