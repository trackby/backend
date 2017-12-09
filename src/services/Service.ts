import { Entity } from '../models/entity';
import { Pool, Client } from 'pg';

export class Service  {

    pool: any

    constructor() {

        console.log("TEST:" + process.env);
        
        this.pool= new Pool ({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT
        })
    }

    public find(): Entity[] {
        throw new Error("find() was not implemented yet")
    }

    public create(ent: Entity): boolean {
        throw new Error("create() was not implemented yet")
    }

    public delete(id: number): boolean {
        throw new Error("delete() was not implemented yet")
    }

    public findOne(id: number): Entity {
        throw new Error("find() was not implemented yet")
    }

}
    