import UserService from '@domain/user/user.service';
import { NextFunction, Request, Response } from 'express';
import { LoginDto, RegisterDto } from '@domain/user/user.dto';
import { validation } from '@utils/validation.util';
import StatusCode from '@enums/status-code.enum';
import { SuccessCode } from '@enums/success-code.enum';
import { IRequest } from '@interfaces/request.interface';
import { IPayload } from '@interfaces/payload.interface';


class UserController {
  public service = new UserService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerData: RegisterDto = req.body;

      await validation(RegisterDto, registerData)

      const result = await this.service.register(registerData)

      res.status(StatusCode.Created).json({
        data: {
          message: SuccessCode.Registered,
          access_token: result
        }
      })
    } catch (error) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: LoginDto = req.body;

      await validation(LoginDto, loginData)

      const result = await this.service.login(loginData)

      res.status(StatusCode.Ok).json({
        data: {
          message: SuccessCode.LoggedIn,
          access_token: result
        }
      })
    } catch (error) {
      next(error)
    }
  }

  public getMe = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const payload: IPayload = req.user;

      const result = await this.service.getById(payload.id);

      res.status(StatusCode.Ok).json({
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  public getPostsByUser = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const user: IPayload = req.user;
      const limit: string = req.query.limit as string;
      const page: string = req.query.page as string;

      const result = await this.service.getPostsByUser(user, limit, page);

      res.status(StatusCode.Ok).json(result)
    } catch(error) {
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
}

export default UserController