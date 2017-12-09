import { Entity } from '../models/entity';
import mysql from 'promise-mysql';
import config from '../config'

export class Service  {

    protected pool: any

    constructor() {
        this.pool = mysql.createPool(config)
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
    