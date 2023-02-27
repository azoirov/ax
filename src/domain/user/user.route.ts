import { Router } from 'express';
import UserController from '@domain/user/user.controller';
import { checkToken } from '@middlewares/check.middleware';

class UserRoute {
  public path ='/users';
  public router = Router()
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.controller.getAll)
    this.router.post(`${this.path}/register`, this.controller.register)
    this.router.post(`${this.path}/login`, this.controller.login)
    this.router.get(`${this.path}/me`, checkToken, this.controller.getMe)
    this.router.get(`${this.path}/my-posts`, checkToken, this.controller.getPostsByUser)
  }
}

export default UserRoute