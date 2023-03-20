import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.service';

@Injectable()
export class ResponseLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl: url, method } = res.req;

    const afterResponse = () => {
      res.removeListener('finish', afterResponse);
      res.removeListener('close', afterResponse);

      let statusCode = res.statusCode.toString();
      let loggerByStatusCode = logger.info;

      switch (statusCode.charAt(0)) {
        case '2':
          statusCode = statusCode.green;
          break;

        case '3':
          statusCode = statusCode.yellow;
          break;

        case '4':
        case '5':
          statusCode = statusCode.red;
          loggerByStatusCode = logger.error;
          break;
      }

      loggerByStatusCode(`${method} ${statusCode} ${url}`);
    };

    res.on('finish', afterResponse);
    res.on('close', afterResponse);

    next();
  }
}
