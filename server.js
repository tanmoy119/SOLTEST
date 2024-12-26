// server.js (or server.ts if you are using TypeScript)
const next = require("next");
const { createServer } = require("https"); // Use https
const { parse } = require("url");
const { readFileSync } = require("fs");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const key = readFileSync("./localhost-key.pem"); // Path to your key
const cert = readFileSync("./localhost.pem"); // Path to your certificate

app.prepare().then(() => {
  createServer({ key, cert }, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`); // Note: https
  });
});
