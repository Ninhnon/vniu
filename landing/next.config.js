// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const path = require("path");

const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: 'Authorization, Content-Type' },
                    { key: "Access-Control-Allow-Credentials", value: "true" }
                ]
            }
        ]
    },
    /* config options here */
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.nike.com',
                port: '',

            },
            {
                protocol: 'https',
                hostname: 'freight.cargo.site',
                port: '',
            }, {
                protocol: 'https',
                hostname: 'media.about.nike.com',
                port: '',
            }
            ,
            {
                protocol: 'https',
                hostname: 'images.lifestyleasia.com',
                port: '',
            }
            ,
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
            }
            ,
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                port: '',
            }
            ,
            {
                protocol: 'https',
                hostname: 'i.dummyjson.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
            },
        ],
    },
    webpack: config => {
        config.experiments = { ...config.experiments, asyncWebAssembly: true, topLevelAwait: true };
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        config.resolve.alias["deepar"] = path.resolve(__dirname, "node_modules/deepar");
        return config
    },
    // Ensure static resources are served correctly
    staticPageGenerationTimeout: 60,
}

module.exports = nextConfig