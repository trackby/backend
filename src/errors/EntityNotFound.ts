
import { NotFoundError } from './NotFoundError'

export class EntityNotFoundError extends NotFoundError {
    constructor() {
        super(404, 'Entity not found!');
    }
}
