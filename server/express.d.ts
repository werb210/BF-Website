export {};

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      user?: Record<string, unknown>;
    }
  }
}
