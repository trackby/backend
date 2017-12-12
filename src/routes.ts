import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { Controller } from './controllers/Controller';

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
    router.get('/entity', Controller.getEntities);
    router.get('/entity/:id', Controller.getEntity);
    router.get('/query/:id', Controller.exampleQuery);
    router.route('/signup').post(AuthController.signup);
  }
}
