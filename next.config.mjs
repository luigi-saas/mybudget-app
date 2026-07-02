import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ["en", "fr", "ar"],
    defaultLocale: "en",
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(nextConfig);
