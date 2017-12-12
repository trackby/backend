import { Pool } from 'pg';
import { User } from '../models/user';

export class Service  {

    protected pool: Pool;
    constructor() {
        this.pool = new Pool ({
            database: process.env.DB_DATABASE,
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
        });
    }

    public async findById(id: number): Promise<any> {
        throw new Error('findById() was not implemented yet');
    }

    public async findAll(): Promise<any[]> {
        throw new Error('findAll() was not implemented yet');
    }

    public async create(ent: any): Promise<number> {
        throw new Error('create() was not implemented yet');
    }

    public async delete(id: number): Promise<number> {
        throw new Error('delete() was not implemented yet');
    }
}
