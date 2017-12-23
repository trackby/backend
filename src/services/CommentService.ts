import { Comment } from '../models/comment';
import { Service } from './service';
import { Reaction } from '../models/reaction';
import { ReactionService } from './ReactionService';
import { ShowService } from './ShowService';


export class CommentService extends Service {
  public async findById(cid: number): Promise<Comment> {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM comment WHERE id = $1';
    try {
      const res = await client.query(sql, [cid]);
      return res.rows[0];
    } catch (e) {
      // console.log(e.stack);
    } finally {
      client.release();
    }
    return null;
  }

  public async create(comment: Comment): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'INSERT INTO comment (comment_body, user_id, parent_id) VALUES($1, $2, $3) RETURNING *';
    try {
      const res = await client.query(sql, [comment.comment_body, comment.user_id, comment.parent_id]);
      return res.rows[0].id;
    } catch (e) {
      console.log(e)
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async delete(sid: number): Promise<number> {
    const client = await this.pool.connect();
    const sql = 'DELETE FROM comment WHERE id = $1 RETURNING id';
    try {
      const res = await client.query(sql, [sid]);
      return res.rows[0].id;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findUserComments(uid: number): Promise<any> {
    console.log('find user comments')
    const showService: ShowService = new ShowService();
    const commentService: CommentService = new CommentService();
    const show_comments = await showService.findUserShowComments(uid);    
    const subcomments = await commentService.findUserSubcomments(uid);
    //episode_comments, season_comments, movie_comments, subcomments

    return {
      show_comments: show_comments,
      subcomments: subcomments
    }
    
  }

  public async findSubcomments(cid: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql =
      'SELECT * FROM comment parent NATURAL JOIN comment sub ' +
      'WHERE sub.parent_id = $1';
    try {
      const res = await client.query(sql, [cid]);
      return res.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }
  
  //gets all subcomments that user entered
  public async findUserSubcomments(uid: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql =
      'SELECT parent.comment_body as parent_body, sub.comment_body, sub.subcomment_count, sub.created_at ' +
      'FROM comment parent INNER JOIN comment sub ON sub.parent_id = parent.id';
    try {
      const res = await client.query(sql);
      return res.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async createCommentReaction(cid: number, reaction: Reaction) {
    const ser: Service = new ReactionService();
    const rid = await ser.create(reaction);

    const client = await this.pool.connect();
    const sql = 'INSERT INTO comment_reaction(reaction_id, comment_id) VALUES($1, $2)';
    try {
      await client.query(sql, [rid, cid]);
      return rid;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async readCommentReactions(cid: number) {
    const client = await this.pool.connect();
    const sql =
    'SELECT reaction_id, reaction_type, COUNT(*) as count FROM comment_reaction ' +
    'INNER JOIN reaction ON comment_reaction.reaction_id = reaction.id ' +
    'INNER JOIN comment ON comment_reaction.comment_id = comment.id WHERE comment_id = $1 ' +
    'GROUP BY reaction_type';
    
    try {
      const res = await client.query(sql, [cid]);
      return res.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;

  }

  public async findUserCommentReactions(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT * FROM comment_reaction ' +
                'INNER JOIN reaction ON comment_reaction.reaction_id = reaction.id ' +
                'INNER JOIN comment ON comment_reaction.comment_id = comment.id WHERE user_id = $1';

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;

  }

}
