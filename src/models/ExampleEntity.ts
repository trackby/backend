

export class ExampleEntity{

    private success:boolean
    private id: number
    private name: string

    constructor(id: number, name: string, success: boolean) {
        this.id = id
        this.name = name
        this.success = success
    }
}
