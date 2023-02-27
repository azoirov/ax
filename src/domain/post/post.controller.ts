import PostService from '@domain/post/post.service';
import { NextFunction, Request, Response } from 'express';
import { CreatePostDto, RatePostDto } from '@domain/post/post.dto';
import StatusCode from '@enums/status-code.enum';
import { validation } from '@utils/validation.util';
import { IdDto } from '@dtos/id.dto';
import { IRequest } from '@interfaces/request.interface';
import { IPayload } from '@interfaces/payload.interface';
import { SuccessCode } from '@enums/success-code.enum';

class PostController {
  public service = new PostService();

  public create = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const createData: CreatePostDto = req.body;
      const payload: IPayload = req.user;

      await validation(CreatePostDto, createData)

      const result = await this.service.create(createData, payload.id);

      res.status(StatusCode.Created).json({
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit: string = req.query.limit as string;
      const page: string = req.query.page as string;

      const result = await this.service.getAll(limit, page);

      res.status(StatusCode.Ok).json(result)
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      await validation(IdDto, { id })

      const result = await this.service.getById(id);

      res.status(StatusCode.Ok).json({
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  public ratePost = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const user: IPayload = req.user;
      const id: string = req.params.id;
      const data: RatePostDto = req.body;

      await validation(RatePostDto, data);

      await this.service.ratePost(id, user, data.rate)

      res.status(StatusCode.Ok).json({
        message: SuccessCode.PostRated
      })
    } catch (error) {
      next(error)
    }
  }
}

export default PostController