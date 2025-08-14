import { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const tsJestPreset = createDefaultPreset();

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",

    // Use ts-jest's default transform for compiling TS
    transform: tsJestPreset.transform,

    // Only consider files with these extensions
    moduleFileExtensions: ["ts", "js", "json"],

    // Root folders to search for tests
    roots: ["<rootDir>/src", "<rootDir>/_test"],

    // Match any `*.test.ts` or `*.spec.ts` files
    testMatch: ["**/?(*.)+(spec|test).ts"],

    // Ignore testing inside these folders
    testPathIgnorePatterns: ["<rootDir>/src/model/", "<rootDir>/src/routes/"],
};

export default config;
