import { Error } from './Error';
export class NotFound extends Error {
    constructor() {
        super(404, 'Not Found');
    }
}
