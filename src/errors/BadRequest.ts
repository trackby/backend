import { Error } from './Error';
export class BadRequest extends Error {
  private description: string;

  constructor(description?) {
    super(400, 'Bad Request');
    this.description = description;
  }
}
