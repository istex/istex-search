import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // Necessary to run in a docker container
  output: "standalone",

  // Automatically transform `import { Stack } from "@mui/material"`
  // into `import Stack from "@mui/material/Stack"` for better tree-shaking
  // and prevent someone from including all of MUI in the final bundle
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
      preventFullImport: true,
    },
  },

  // Don't bundle the log dependencies with the rest of the server components,
  // let them be `require`d by Node.js
  serverExternalPackages: ["pino", "pino-pretty"],

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

  // Linting is done in a separate CI step
  eslint: {
    ignoreDuringBuilds: true,
  },
});
