// src/types/express.d.ts
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // optional or string if you always set it
  }
}
//"Hey TS, please extend the original Request type from Express to include a new property I’m adding myself — userId."