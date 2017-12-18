import { Error } from './Error';

export class UnprocessableEntity extends Error {
	constructor() {
		super(422, 'Unprocessable Entity');
	}
}
