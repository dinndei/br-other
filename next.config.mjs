/** @type {import('next').NextConfig} */


export default {
    experimental: {
        // אפשר WebSockets דרך חיבור HTTP
        serverComponentsExternalPackages: ["socket.io"],
    },
};




