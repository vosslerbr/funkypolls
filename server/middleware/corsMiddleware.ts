import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';

const whitelist: string[] = [];
const corsOptions: CorsOptions | CorsOptionsDelegate = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    /**
     * Checks if the origin is allowed based on whitelist or non-production environment.
     * @param {string | undefined} origin - The origin of the request.
     * @param {(err: Error | null, allow?: boolean) => void} callback - The callback function to invoke with the result.
     */
    const isAllowedOrigin = !origin || whitelist.includes(origin);
    const isNonProduction = process.env.NODE_ENV !== 'production';

    if (isNonProduction || isAllowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;