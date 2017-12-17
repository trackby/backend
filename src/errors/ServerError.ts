import { Error } from './Error';

export class ServerError extends Error {
    constructor() {
        super(500, 'Looks like we are having some trouble over here.');
    }
}
