const path = require("path");
const srcDirPath = path.join(__dirname, "src");

const withNextIntl = require("next-intl/plugin")(
  path.join(srcDirPath, "i18n", "i18n.ts")
);

/** @type {import('next').NextConfig} */
module.exports = withNextIntl({
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
});
