import { Entity } from './entity'


export class Show extends Entity{

    info: string
    trailer_url: string
    image_url: string
    show_name: string

    constructor(id: number, name: string, info: string, trailer_url: string, image_url: string) {
        super(id)
        this.show_name = name
        this.info = info
        this.trailer_url = trailer_url
        this.image_url = image_url
    }
}

export class ShowComment extends Entity {
    /*show_comment table */
    show_id: number 
    comment_id: number

    constructor(id: number, show_id: number, comment_id: number) {
        super(id)
        this.show_id = show_id
        this.comment_id = comment_id
    }
}
