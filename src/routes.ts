import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { CommentController } from './controllers/CommentController';
import { Controller } from './controllers/Controller';
import { FriendshipController } from './controllers/FriendshipController';
import { ShowController } from './controllers/ShowContoller';
import { UploadController } from './controllers/UploadController';

/**
 * / route
 *
 * @class User
 */
export class Routes {
  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    router.use((req, res, next) => {
      next();
    });

    router.get('/', Controller.sayHello);

    // trackby.me routes
    router.route('/signup').post(AuthController.signup);
    router.route('/auth').post(AuthController.authenticate);
    router.get('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

    // allah muhammet aşkına şunu en sonda aktif edin test edemiyorum postları vs, productiona aldım o yüzden

    /* only active on production */
    if (process.env.NODE_ENV === 'production') {
      router.use(AuthController.protect);
    }

    /*
    * Below routes are protected and cannot be accessed without authentication token.
    * Place the resources that need login operation to be accessed below:
    */

    router.post('/protected', (req, res) => {
      res.json({ message: 'Hoorayyy! Welcome to TrackBy!' });
    });

    router.get('/shows', ShowController.readShows);
    router.get('/shows/:showid', ShowController.readShow);
    router.get('/shows/:showid/comments', ShowController.readShowComments);
    router.get('/shows/:showid/comments/:commentid', ShowController.readShowComment);
    router.get('/comments', CommentController.readAllComments);
    router.get('/comments/:commentid', CommentController.readComment);
    router.get('/comments/:commentid/subcomments', CommentController.readSubcomments);

    /*
    * Below routes are protected and cannot be accessed without authentication token + admin privileges
    * Place the resources that need both login operation and admin privileges to be accessed below:
    * (Also some routes may be accessed with 'get' by users but cannot be accessed with 'post', 'delete', 'patch')
    * Example: /protected is open for get requests but not for post requests.
    */

    router.get('/friendships/requests/', AuthController.protect, FriendshipController.showFriendshipRequests);

    router.get('/friendships/show/', FriendshipController.showFriendshipRelation);

    router.get('/user/:username/friends', FriendshipController.showFriends);

    router.post('/shows/:showid/watch', ShowController.markAsWatched);
    router.delete('/shows/:showid/watch', ShowController.unmarkWatch);
    router.post('/shows/:showid/comments', ShowController.createShowComment);

    router.delete('/shows/:showid', ShowController.deleteShow);
    router.post('/shows', ShowController.createShow);

    router.post('/friendships/create', FriendshipController.sendFriendshipRequest);
    router.patch('/friendships/update', FriendshipController.updateFriendshipStatus);
    router.delete('/friendships/remove', FriendshipController.removeFriend);

    router.post('/upload', UploadController.upload);
  }
}
