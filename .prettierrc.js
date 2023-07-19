module.exports = {
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
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
