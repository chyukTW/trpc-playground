/* eslint-disable @typescript-eslint/no-unused-vars */

// @ts-expect-error: fix later
namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    // @ts-expect-error: fix later
    DB_PORT: number;
    DB_USER: string;
    // @ts-expect-error: fix later
    PORT: number;
  }
}
