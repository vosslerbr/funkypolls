/**
 * Module for applying middleware to the Express application.
 *
 * @module middleware/index
 */

import helmet from "helmet";
import corsMiddleware from "./corsMiddleware";
import { rateLimiter, speedLimiter } from "./limiterMiddleware";
import morgan from "morgan";
import express, { Express } from "express";

const applyMiddleware = (app: Express) => {
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(helmet());
  app.set("trust proxy", 1);
  app.use(speedLimiter);
  app.use(rateLimiter);
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
};

export default applyMiddleware;
