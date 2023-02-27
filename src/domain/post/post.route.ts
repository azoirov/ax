import { Router } from 'express';
import PostController from '@domain/post/post.controller';
import { checkToken } from '@middlewares/check.middleware';

class PostRoute {
  public path ='/posts';
  public router = Router()
  public controller = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, checkToken, this.controller.create)
    this.router.get(`${this.path}/`, this.controller.getAll)
    this.router.get(`${this.path}/:id`, this.controller.getById)
    this.router.post(`${this.path}/:id/rate`, checkToken, this.controller.ratePost)
  }
}

export default PostRoute