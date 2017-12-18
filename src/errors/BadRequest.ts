import { Error } from './Error';
export class BadRequest extends Error {
  constructor() {
    super(400, 'Bad Request');
  }
}
