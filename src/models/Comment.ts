
export class Comment{

    id: number
    body: string
    user_id: number
    parent_id: number

    constructor(id: number, body:string, user_id: number, parent_id: number) {
        this.body = body
        this.id = id
        this.user_id = user_id
        this.parent_id = parent_id
    }
}

