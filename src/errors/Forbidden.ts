import { Error } from './Error';
export class Forbidden extends Error {
  private description: string;

  constructor(description?) {
    super(403, 'Forbidden');
    this.description = description;
  }
}
