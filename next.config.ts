import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  output: "standalone",
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
      preventFullImport: true,
    },
  },
  // Custom webpack config overwrite to use svgr alongside next-image-loader for SVGs
  webpack: (config) => {
    // Get the default SVG loader from Next.js
    const defaultSvgLoader = config.module.rules.find(
      (rule: { test?: { test: (a: string) => boolean } } | null) =>
        typeof rule?.test?.test === "function" && rule.test.test(".svg"),
    );

    // Re-add the default Next.js image loader for SVGs but don't use it when the
    // path ends with ".svg?svgr"
    config.module.rules.push({
      ...defaultSvgLoader,
      test: /\.svg$/i,
      resourceQuery: { not: [/svgr/] },
    });

    // Add the svgr rule but use it only the path ends with ".svg?svgr"
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.tsx?$/,
      resourceQuery: /svgr/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});
