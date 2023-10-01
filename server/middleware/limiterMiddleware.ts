import slowDown from 'express-slow-down';
import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';

const speedLimiter: RequestHandler = slowDown({
  windowMs: 15 * 60 * 1000, // 15 mins
  delayAfter: 25, // slow down after 25 requests per 15 mins
  delayMs: 500, // begin adding 500ms of delay per request above 25 requests
});

const rateLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export { speedLimiter, rateLimiter };