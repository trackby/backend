import { Pool } from 'pg';

export class Service  {

    protected pool: Pool

    constructor() {        
        this.pool= new Pool ({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT
        })
    }

    public async findById(id: number): Promise<any> {
        throw new Error("findById() was not implemented yet")        
    }

    public async findAll(): Promise<any[]> {
        throw new Error("findAll() was not implemented yet")        
    }

    public async create(ent: any): Promise<number> {
        throw new Error("create() was not implemented yet")        
    }

    public async delete(id: number): Promise<number> {
        throw new Error("delete() was not implemented yet")        
    }
    
}