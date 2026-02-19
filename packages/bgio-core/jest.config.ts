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
    "^@bgio/client$": "<rootDir>/../../bgio-client/src/client",
    "^@bgio/client/(.*)$": "<rootDir>/../../bgio-client/src/$1",
  },
};
