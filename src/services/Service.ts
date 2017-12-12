import { Client, Pool } from 'pg';
import { User } from '../models/user';

export class Service  {

    public pool: Pool;
    constructor() {
        this.pool = new Pool ({
            database: process.env.DB_DATABASE,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
        });
    }

    public find(): User[] {
        throw new Error('find() was not implemented yet');
    }

    public create(ent: User): boolean {
        throw new Error('create() was not implemented yet');
    }

    public delete(id: number): boolean {
        throw new Error('delete() was not implemented yet');
    }

    public findOne(id: number): User {
        throw new Error('find() was not implemented yet');
    }

}
