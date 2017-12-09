import { Entity } from '../models/entity';


export class Service  {

    constructor() {
        //db adapter
    }

    public find(): Entity[] {
        let arr: Entity[] = [
            {id : 1, name: "Fatih"},
            {id: 2, name: "Gokcan"},
            {id: 3, name: "Onur"}
        ];
        return arr
    }

    public findOne(id: number): Entity {
        return {id: id, name: "Fatih"}
    }


}
    