import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^~/(.*)$': '<rootDir>/src/$1',
    },
    // Ignore network tests since those require libp2p which ts-jest is unable to handle
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.*/.*network.test.*'],
  };
};
