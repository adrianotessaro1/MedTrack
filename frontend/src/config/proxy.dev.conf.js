const PROXY_CONFIG = {
    '/api': {
        target: 'http://dev-api-xingu.openxsolutions.com.br/',
        secure: false,
        changeOrigin: true,
        onProxyRes(proxyRes)
        {
            let newCookies;

            if (newCookies = proxyRes.headers['set-cookie'])
            {
                newCookies[0] = newCookies[0]
                    .replace(/HttpOnly;/gi, '')
                    .replace(/Secure/gi, '');
            }
        }
    }
};

module.exports = PROXY_CONFIG;