import { Controller } from "./controllers/Controller"
import { Router } from 'express'

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
    //log
    console.log("[IndexRoute::create] Creating index route.");

    //add home page route
    router.get("/", Controller.sayHello);
    router.get("/entity", Controller.getEntities);
    router.get("/entity/:id", Controller.getEntity);
    
  }


}