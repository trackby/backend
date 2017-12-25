import { Service } from './service';

export class FeedService extends Service {
  public async findEpisodeComments(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT episode.show_name, episode.season_no, episode.episode_no, comment.comment_body, comment.created_at, \'episodecomment\' AS type FROM episode_comment ' +
                'INNER JOIN episode ON episode_comment.show_name = episode.show_name AND episode_comment.season_no = episode.season_no AND episode_comment.episode_no = episode.episode_no ' +
                'INNER JOIN comment ON episode_comment.comment_id = comment.id ' +
                'INNER JOIN users ON comment.user_id = users.id WHERE comment.user_id IN '+                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY comment.created_at DESC';
    try {
      const res = await client.query(sql, [uid]);
    return res.rows;
    } catch (e) {
      console.log(e)
    // console.log(e.stack)
    } finally {
    client.release();
    }
    return null;
  }

  public async findSubcomments(uid: number): Promise<Comment[]> {
    const client = await this.pool.connect();
    const sql = 
      'SELECT parent.comment_body as parent_body, users.username, users.image_url, sub.comment_body, sub.subcomment_count, sub.created_at, \'subcomment\' AS type ' +
      'FROM comment parent INNER JOIN comment sub ON sub.parent_id = parent.id '+
      'INNER JOIN users ON sub.user_id = users.id WHERE sub.user_id IN '+
      '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY sub.created_at DESC';
    
    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findSeasonComments(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, users.image_url, season.show_name, season.season_no, comment.comment_body, comment.created_at, \'seasoncomment\' AS type FROM season_comment ' +
                'INNER JOIN season ON season_comment.show_name = season.show_name AND season_comment.season_no = season.season_no ' +
                'INNER JOIN comment ON season_comment.comment_id = comment.id ' +
                'INNER JOIN users ON comment.user_id = users.id WHERE comment.user_id IN '+
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY comment.created_at DESC';
    try {
      const res = await client.query(sql, [uid]);
    return res.rows;
    } catch (e) {
      console.log(e)
    // console.log(e.stack)
    } finally {
    client.release();
    }
    return null;
  }


  public async findShowComments(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, users.image_url, tvshow.show_name, comment.comment_body, comment.created_at, \'showcomment\' as type FROM show_comment ' +
                'INNER JOIN tvshow ON show_comment.show_name = tvshow.show_name ' +
                'INNER JOIN comment ON show_comment.comment_id = comment.id ' +
                'INNER JOIN users ON comment.user_id = users.id WHERE comment.user_id IN '+
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY comment.created_at DESC';

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)
      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findShowWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, tvshow.show_name, watch.created_at, \'showwatches\' as type FROM show_watch ' +
                'INNER JOIN tvshow ON show_watch.show_name = tvshow.show_name ' +
                'INNER JOIN watch ON show_watch.watch_id = watch.id ' +
                'INNER JOIN users ON watch.user_id = users.id WHERE watch.user_id IN '+                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY watch.created_at DESC'; 

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)
      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findSeasonWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, season.show_name, season.season_no, watch.created_at,  \'seasonwatches\' as type FROM season_watch ' +
                'INNER JOIN season ON season_watch.show_name = season.show_name AND season_watch.season_no = season.season_no ' +
                'INNER JOIN watch ON season_watch.watch_id = watch.id ' +
                'INNER JOIN users ON watch.user_id = users.id WHERE watch.user_id IN '+                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY watch.created_at DESC'; 

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)
      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findEpisodeWatches(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, episode.show_name, episode.season_no, episode.episode_no, watch.created_at, \'episodewatches\' as type FROM episode_watch ' +
                'INNER JOIN episode ON episode_watch.show_name = episode.show_name AND episode_watch.season_no = episode.season_no AND episode_watch.episode_no = episode.episode_no ' +
                'INNER JOIN watch ON episode_watch.watch_id = watch.id ' +
                'INNER JOIN users ON watch.user_id = users.id WHERE watch.user_id IN '+                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY watch.created_at DESC'; 

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)
      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findShowRates(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, tvshow.show_name, rate.rating, rate.created_at, \'showrates\' as type  FROM show_rate ' +
                'INNER JOIN tvshow ON show_rate.show_name = tvshow.show_name ' +
                'INNER JOIN rate ON show_rate.rate_id = rate.id ' +
                'INNER JOIN users ON rate.user_id = users.id WHERE rate.user_id IN ' +                                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY rate.created_at DESC'; 

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

  public async findSeasonRates(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, season.show_name, season.season_no, rate.rating, rate.created_at,  \'seasonrates\' as type  FROM season_rate ' +
                'INNER JOIN season ON season_rate.show_name = season.show_name AND season_rate.season_no = season.season_no ' +
                'INNER JOIN rate ON season_rate.rate_id = rate.id ' +
                'INNER JOIN users ON rate.user_id = users.id WHERE rate.user_id IN ' +                                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY rate.created_at DESC'; 

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }



  public async findEpisodeRates(uid: number) {
    const client = await this.pool.connect();
    const sql = 'SELECT users.username, episode.show_name, episode.season_no, episode.episode_no, rate.rating, rate.created_at, \'episoderates\' as type  FROM episode_rate ' +
                'INNER JOIN episode ON episode_rate.show_name = episode_rate.show_name AND episode_rate.season_no = episode.season_no AND ' +
                'episode_rate.episode_no = episode.episode_no  ' +
                'INNER JOIN rate ON episode_rate.rate_id = rate.id ' +
                'INNER JOIN users ON rate.user_id = users.id WHERE rate.user_id IN ' +                                
                '(SELECT second_user_id FROM friends_view WHERE first_user_id = $1) ORDER BY rate.created_at DESC'; 

    try {
      const res = await client.query(sql, [uid]);
      return res.rows;
    } catch (e) {
      console.log(e)      
      // console.log(e.stack)
    } finally {
      client.release();
    }
    return null;
  }

}
