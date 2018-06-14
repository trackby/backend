import { FriendshipController } from '../controllers/FriendshipController';
import { Friendship } from '../models/Friendship';
import { User } from '../models/User';
import { Service } from './service';
import { UserService } from './UserService';

type FriendshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type FriendshipRequestDirection = 'INCOMING' | 'OUTGOING';

const service = new UserService();

export class FriendshipService extends Service {
  public async showFriendshipRelation(firstUserId: number, secondUserId: number): Promise<Friendship> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM friendship WHERE first_user_id = $1 AND second_user_id = $2';
    const sortedIds: any = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => a - b);

    try {
      const res = await client.query(sql, sortedIds);
      if (res.rows[0]) {
        return res.rows[0];
      }
    } catch (e) {
      throw new Error(`There is some error during the showFriendship operation on id='${firstUserId}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async showFriendshipRequests(userId: number, direction: FriendshipRequestDirection): Promise<User> {
    const client = await this.pool.connect();
    const values = [ userId ];
    let predicate = 'IS DISTINCT FROM';

    if (direction.toUpperCase() === 'OUTGOING') {
      predicate = 'IS NOT DISTINCT FROM';
    }

    const sql = `SELECT id, username, email FROM users WHERE id
    IN (SELECT second_user_id FROM friendship_requests WHERE first_user_id=$1 AND action_user_id ${predicate} $1) `;

    try {
      const res = await client.query(sql, values);
      if (res.rows) {
        return res.rows;
      }
    } catch (e) {
      throw new Error(`There is some error during the showFriendshipRequests operation on id='${userId}'.`);
    } finally {
      client.release();
    }
    return undefined;
  }

  public async save(friendship: Friendship): Promise<Friendship> {
    const { firstUserId, secondUserId, status, actionUserId } = friendship;
    const client = await this.pool.connect();
    const sql = `INSERT INTO friendship (first_user_id, second_user_id, status, action_user_id)
                VALUES($1, $2, $3, $4) RETURNING *`;

    const sortedIds: any = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => a - b);
    const values = sortedIds.concat([ status, actionUserId ]);

    try {
      const res = await client.query(sql, values);
      return res.rows[0];
    } catch (e) {
      throw new Error(`There is some error during the save operation on friendship='${friendship}' .`);
    } finally {
      client.release();
    }
  }

  public async update(friendship: Friendship): Promise<Friendship> {
    const { firstUserId, secondUserId, status, actionUserId } = friendship;
    const client = await this.pool.connect();
    const sql = `UPDATE friendship SET status = $3 WHERE first_user_id = $1 AND second_user_id = $2 RETURNING *`;
    const sortedIds: any = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => a - b);
    const values = sortedIds.concat([ status ]);

    try {
      const res = await client.query(sql, values);
      return res.rows[0];
    } catch (e) {
      throw new Error(`There is some error during the update operation on friendship='${friendship}' .`);
    } finally {
      client.release();
    }
  }

  public async delete(id: number, friendship?: Friendship): Promise<Friendship> {
    const { firstUserId, secondUserId } = friendship;
    const client = await this.pool.connect();
    const sql = `DELETE FROM friendship WHERE first_user_id = $1 AND second_user_id = $2
                   AND status IN ('APPROVED', 'PENDING') RETURNING *`;

    const sortedIds: number[] = [ firstUserId, secondUserId ];
    sortedIds.sort((a, b) => a - b);
    const values = sortedIds;

    try {
      const res = await client.query(sql, values);
      return res.rows[0];
    } catch (e) {
      throw new Error(`There is some error during the delete operation on friendship='${friendship}' .`);
    } finally {
      client.release();
    }
  }

  public async findAllFriends(username: string): Promise<User[]> {
    const client = await this.pool.connect();
    const sql = `SELECT id, username, email FROM users WHERE id
                IN (SELECT second_user_id FROM friends_view WHERE first_user_id=$1) `;
    try {
      const userId = await service.findByUsername(username);
      const values = [ userId.id ];
      const res = await client.query(sql, values);
      return res.rows;
    } catch (e) {
      throw new Error(`There is some error during the findAll operation on friendship='${username}' .`);
    } finally {
      client.release();
    }
  }
}
