import { Error } from './Error';

export class Unauthorized extends Error {
  constructor() {
    super(401, 'Unauthorized. It maybe invalid username or password. That\'s all we know.');
  }
}
