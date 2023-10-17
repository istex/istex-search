import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  setupFilesAfterEnv: ["<rootDir>/src/jest-setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/src/$1"],
  },
});
