declare module 'express-session' {
  interface SessionData {
    user?: {
      uuid: string;
    };
  }
}

export {};
