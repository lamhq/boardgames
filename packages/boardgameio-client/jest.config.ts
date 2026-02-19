export default {
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  rootDir: "src",
  testRegex: ".*\\.test\\.(ts|tsx)$",
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest"],
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/../jest.setup.ts"],
  moduleNameMapper: {
    "^@boardgameio/core$": "<rootDir>/../../boardgameio-core/src",
    "^@boardgameio/core/(.*)$": "<rootDir>/../../boardgameio-core/src/$1",
  },
};
