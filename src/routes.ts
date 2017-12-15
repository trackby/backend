import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { Controller } from './controllers/Controller';
import { ShowController } from './controllers/ShowContoller';

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

    router.post('/shows', ShowController.createShow);
    router.get('/shows', ShowController.readShows);
    router.get('/shows/:showid', ShowController.readShow);
    router.delete('/shows/:showid', ShowController.deleteShow);
    router.get('/shows/:showid/comments', ShowController.readShowComments);
    router.get('/shows/:showid/comments/:commentid', ShowController.readShowComment);

  }
}
