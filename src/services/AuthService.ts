import * as bcrypt from 'bcrypt';
import { request } from 'http';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Service } from './service';
export class AuthService extends Service {
    private key: string;
    constructor() {
        super();
        this.key = process.env.SECRET_KEY;
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
    public async comparePass(given: string, username: string) {
        const user: User = await this.findOne(username);
        const stored: string = user.password;

        const isMatch: boolean = await bcrypt.compare(given, stored).catch((error) => { throw new Error(error); });
        return isMatch;
    }

    public async findOne(username: string): Promise<User> {
        const client = await this.pool.connect();
        const sql = 'SELECT * FROM users WHERE username = $1';
        try {
            const res = await client.query(sql, [username]);
            if (res.rows[0]) {
                return res.rows[0];
            }
        } catch (e) {
            // console.log(e.stack)
        } finally {
          client.release();
        }
        return null;
    }

    public signJWT(username: string) {
        const token = jwt.sign({ __username: username }, this.key, {
            expiresIn: 60 * 60 * 24,
            issuer: 'trackby',
        });
        if (token) {
            return token;
        }
    }

    public verifyJWT(token: string): boolean {
        if (token) {
            try {
                const decoded: string | object =  jwt.verify(token, this.key, {issuer: 'trackby'});
                return decoded ? true : false;
            } catch (e) {
             // console.log(e.stack);
            }
        }
        return false;
    }
}
