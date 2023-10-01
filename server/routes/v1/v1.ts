/**
 * Module for creating and exporting the router instance.
 *
 * @module router
 */

import express from "express";
import exampleRoute from "./exampleRoute";
const router = express.Router();

router.get("/example", exampleRoute);

export default router;
