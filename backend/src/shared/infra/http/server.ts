import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import uploadConfig from '@config/upload';
import RequestError from '@shared/errors/RequestError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import routes from './routes';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof RequestError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Hello from the Moon...');
});
