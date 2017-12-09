import { Entity } from '../models/entity';
import mysql = require('promise-mysql');

export class Service  {

    protected pool: any

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        })
        //db adapter
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
    