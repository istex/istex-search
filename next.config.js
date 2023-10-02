const path = require("path");
const srcDirPath = path.join(__dirname, "src");

const withNextIntl = require("next-intl/plugin")(
  path.join(srcDirPath, "i18n", "i18n.tsx")
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
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
      preventFullImport: true,
    },
    "@mui/material/styles": {
      transform: "@mui/material/styles/{{member}}",
      preventFullImport: true,
    },
  },
});
