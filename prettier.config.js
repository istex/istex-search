/** @type {import("prettier").Config} */
const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react(.*)$",
    "^next(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@mui/(.*)$",
    "^[./]",
    "^@/(.*)$",
    "^@/types/(.*)$",
  ],
};

export default config;
