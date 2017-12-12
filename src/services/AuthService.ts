import { User } from '../models/user';
import { Service } from './service';

export class AuthService extends Service {
    constructor() {
        super();
    }
    public async isUserExists(username: string): Promise<boolean> {
            const client = await this.pool.connect();
            try {
              const res = await client.query('SELECT * FROM users WHERE name = $1', [username]);
              if (res.rows[0]) {
                  return true;
              }
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.log(e.stack);
            } finally {
              client.release();
            }
            return false;
    }
    public async save(user: User): Promise<boolean> {
        const { username, password } = user;
        const values = [username, password];
        const sql = 'INSERT INTO users(name, password) VALUES($1, $2) RETURNING *';
        // TODO(1): encrypt the password before save (use bcrypt with salt)

        const client = await this.pool.connect();
        try {
          const res = await client.query(sql, values);
          if (res.rows[0]) {
              user.id = res.rows[0].id;
              return true;
          }
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e.stack);
        } finally {
          client.release();
        }
        return false;
    }
}
