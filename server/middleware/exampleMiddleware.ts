import { Request, Response, NextFunction } from 'express';


/**
 * Example middleware function for an Express.js project.
 * @param req The incoming request object.
 * @param res The response object.
 * @param next The next middleware function.
 */
const middlewareExample = async (req: Request, res: Response, next: NextFunction) => {
    // Your middleware logic here
}

export default middlewareExample;