const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Unblocked Proxy</title></head>
      <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
        <h2>Enter a website URL</h2>
        <form action="/browse" method="get">
          <input type="text" name="url" placeholder=" " style="width:300px; padding:10px;">
          <button type="submit" style="padding:10px 15px;">Go</button>
        </form>
      </body>
    </html>
  `);
});

app.use('/browse', (req, res, next) => {
  let targetUrl = req.query.url;
  if (!targetUrl) return res.send("Please enter a URL.");

  // Trim spaces
  targetUrl = targetUrl.trim();

  // If the user didn't include http:// or https://, automatically add https://
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  let targetHost;
  try {
    targetHost = new URL(targetUrl).origin;
  } catch (e) {
    return res.send("Invalid URL.");
  }

  return proxy(targetHost, {
    proxyReqOptDecorator: (proxyReqOpts) => {
      proxyReqOpts.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      proxyReqOpts.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
      proxyReqOpts.headers['Accept-Language'] = 'en-US,en;q=0.5';
      proxyReqOpts.headers['Referer'] = targetHost;
      return proxyReqOpts;
    }
  })(req, res, next);
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
