export default {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest"],
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@boardgameio/client$": "<rootDir>/../../boardgameio-client/src/client",
    "^@boardgameio/client/(.*)$": "<rootDir>/../../boardgameio-client/src/$1",
  },
};
