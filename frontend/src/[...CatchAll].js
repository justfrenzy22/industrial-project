import { createProxyMiddleware } from "http-proxy-middleware";
import Cookies from 'cookies';

const apiProxy = createProxyMiddleware({
  target: "http://localhost:8000",
  changeOrigin: true,
  pathRewrite: { "^/api" : "" },
  secure: false,
  onProxyReq: async (proxyReq, req) => {
    const cookies = new Cookies(req, null);
    const accessToken = cookies.get("authorization");

    if (accessToken && proxyReq && proxyReq.setHeader) {
      proxyReq.setHeader("authorization", `${accessToken}`);
      console.log(`Authorization header set`)
    } else {
      console.log(`Authorization header not set`);
    }
  },
});




const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });

const handle = async (req, res) => runMiddleware(req, res, apiProxy);

export const config = {
    runtime: 'nodejs',
  api: {
    externalResolver: true,
    bodyParser: false,
    responseLimit: false,
  },
};

export default handle;

//! credit ivelin09 https://github.com/Ivelin09/hackernews/blob/main/front-end/pages/api/%5B...catchAll%5D.js