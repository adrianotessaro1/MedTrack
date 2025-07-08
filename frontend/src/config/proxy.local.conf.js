const PROXY_CONFIG = {
  "/api/v1": {
    target: "http://localhost:8080/",
    secure: false,
    changeOrigin: true,
    onProxyRes(proxyRes) {
      let newCookies;

      if ((newCookies = proxyRes.headers["set-cookie"])) {
        newCookies[0] = newCookies[0]
          .replace(/HttpOnly;/gi, "")
          .replace(/Secure/gi, "");
      }
    },
  },
};

module.exports = PROXY_CONFIG;
