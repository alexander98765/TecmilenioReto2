import { HttpException, HttpStatus } from '@nestjs/common';

/**
   * Make notfoundexception part of httpexeption
   *
   * @extends HttpException
   * 
   * Extends NotFoundException to be cauhgt by the http exception filter
   * 
*/
export class NotFoundException extends HttpException {
    constructor(message: string) {
      super(message, HttpStatus.NOT_FOUND);
    }
  }