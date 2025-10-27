import cors from 'cors';

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Allow common dev hosts (Vite default 5173 and changed port 3000 used here). In production
// set FRONTEND_ORIGIN env variable to restrict.
const allowedOrigins = [FRONTEND_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;