import { Entity } from './entity'



export class ExampleEntity extends Entity{

    private success:boolean

    constructor(id: number, name: string, success: boolean) {
        super(id, name)
        this.success = success
    }
}
