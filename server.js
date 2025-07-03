import express from "express";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = process.env.PORT || 3000;
const apiUrl = "https://kaleidosync-api-690ea0e25a5b.herokuapp.com";

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// API proxy middleware - proxy all /api/* requests to the API server
app.use('/api', createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to API server
  }
}));

app.use(express.static("dist"));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Serving static files from: dist`);
  console.log(`API proxy enabled: /api/* -> ${apiUrl}`);
});
