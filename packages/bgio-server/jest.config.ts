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
    "^@bgio/core$": "<rootDir>/../../bgio-core/src",
    "^@bgio/core/(.*)$": "<rootDir>/../../bgio-core/src/$1",
  },
};
