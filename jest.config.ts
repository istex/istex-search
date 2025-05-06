import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const config = async () => ({
  ...(await createJestConfig({
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "^@/(.*)$": ["<rootDir>/src/$1"],
    },
  })()),
  transformIgnorePatterns: ["node_modules/(?!next-intl)/"],
});

export default config;
