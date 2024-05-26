import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

/**
   * Configure httpexception filter
   *
   * @implements ExceptionFilter
   * 
   * Catch HTTPExceptions and print a customized message to user
   * 
   * @remarks
   * This module is activated inside of main.ts file
   * 
*/
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        description: exception["response"]["message"],
        detail: exception.message
        
      });
  }
}