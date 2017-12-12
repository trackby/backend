import { User} from './user';

export class ExampleEntity extends User {
    private success: boolean;
    constructor(id: number, name: string, password: string, success: boolean) {
        super(id, name, password);
        this.success = success;
    }
}
