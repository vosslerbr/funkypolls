import { ErrorRequestHandler } from 'express';
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err); // Log the error
  
    // Set a default status code and error message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Respond with the error
    res.status(statusCode).json({ error: message });
};

export default errorHandler;