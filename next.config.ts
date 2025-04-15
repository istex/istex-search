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

  // Linting is done in a separate CI step
  eslint: {
    ignoreDuringBuilds: true,
  },
});
