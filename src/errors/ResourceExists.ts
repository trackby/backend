import { Error } from './Error';

export class ResourceExists extends Error {
	constructor() {
		super(409, 'This resource already exists. Maybe there are some typo in your request parameters?');
	}
}
