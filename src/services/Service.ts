import { Entity } from '../models/entity';


export class Service  {

    constructor() {
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
    