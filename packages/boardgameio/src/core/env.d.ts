/**
 * Minimal ambient declarations for Node.js globals used in core.
 * Allows core code to be compiled for both browser and node targets
 * without requiring the full @types/node package.
 */

declare namespace NodeJS {
  interface Timeout {}
}

declare const process: {
  env: {
    NODE_ENV?: string;
    [key: string]: string | undefined;
  };
};

declare function setImmediate(callback: (...args: any[]) => void, ...args: any[]): any;
