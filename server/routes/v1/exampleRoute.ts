/**
 * Module defining the handler for the "/example" route.
 * The handler sends a 'Example Route!' message in the response.
 *
 * @module exampleRoute
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */

import { Request, Response } from "express";
const exampleRoute = (req: Request, res: Response) => {
  res.send("Example Route!");
};

export default exampleRoute;
