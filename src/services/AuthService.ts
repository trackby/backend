import * as bcrypt from 'bcrypt';
import { User } from '../models/user';
import { Service } from './service';
export class AuthService extends Service {
    constructor() {
        super();
    }
    public async isUserExists(username: string): Promise<boolean> {
            const client = await this.pool.connect();
            try {
              const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
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
        const salt = await bcrypt.genSalt(10).catch((error) => { throw new Error(error); });
        const hashedPass = await bcrypt.hash(password, salt).catch((error) => { throw new Error(error); });

        const values = [username, hashedPass];
        const sql = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';

        const client = await this.pool.connect();
        try {
          const res = await client.query(sql, values);
          if (res.rows[0]) {
              user.id = res.rows[0].id;
              // tslint:disable-next-line:no-console
              console.dir(user);
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
    public comparePass(given: string, stored: string) {
        const isMatch: boolean = bcrypt.compareSync(given, stored);
        return isMatch;
      }
}
