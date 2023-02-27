import UserRepo from '@domain/user/user.repo';
import { CreateUserDto, LoginDto } from '@domain/user/user.dto';
import { IUser } from '@domain/user/user.interface';
import BadRequestError from '@errors/bad-request.error';
import ErrorCode from '@enums/error-code.enum';
import NotFoundError from '@errors/not-found.error';
import { IPayload } from '@interfaces/payload.interface';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import UnauthorizedError from '@errors/unauthorized.error';
import { hashPassword, validatePassword } from '@utils/password.util';
import { Types } from 'mongoose';
import { IPagedResult } from '@interfaces/pagination.interface';
import { IPost } from '@domain/post/post.interface';
import PostRepo from '@domain/post/post.repo';

class UserService {
  public repo = new UserRepo();
  public postRepo = new PostRepo();

  public create = async (data: CreateUserDto): Promise<IUser> => {
    const { email } = data;

    const user = await this.repo.getByEmail(email);
    if(user) throw new BadRequestError(ErrorCode.UserWithThisEmailAlreadyExists)

    return this.repo.create(data)
  }

  public register = async (data: CreateUserDto): Promise<string> => {
    const { email, password } = data;

    const user = await this.repo.getByEmail(email);
    if(user) throw new BadRequestError(ErrorCode.UserWithThisEmailAlreadyExists);

    const hash = await hashPassword(password);

    const result = await this.repo.create({
      email,
      password: hash
    });

    const payload: IPayload = {
      id: result._id,
      email: result.email
    }

    return this.generateToken(payload)
  }

  public login = async (data: LoginDto): Promise<string> => {
    const { email, password } = data;

    const user = await this.repo.getByEmail(email);
    if(!user) throw new NotFoundError(ErrorCode.UserNotFound);

    const isPasswordMatched = await validatePassword(password, user.password)
    if(!isPasswordMatched) throw new BadRequestError(ErrorCode.IncorrectPassword)

    const payload: IPayload = {
      id: user._id,
      email: user.email
    }

    return this.generateToken(payload)
  }

  public getById = async (id: Types.ObjectId): Promise<IUser> => {
    const user = await this.repo.getById(id);
    if(!user) throw new NotFoundError(ErrorCode.UserNotFound);

    const rate  = await this.postRepo.getUserRate(id.toString());

    return {
      ...user,
      rate: rate?._id || 0
    }
  }

  private generateToken = (payload: IPayload): Promise<string> => {
    const secret = process.env.ACCESS_TOKEN_SECRET

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, async (error: Error | null, token: string) => {
        if(error) return reject(error)

        resolve(token)
      })
    })
  }

  private verifyToken = (token: string): Promise<IPayload> => {
    const secret = process.env.ACCESS_TOKEN_SECRET

    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err: VerifyErrors | null, tokenPayload: IPayload) => {
        if (err) return reject(new UnauthorizedError());

        resolve(tokenPayload);
      });
    });
  };

  public getPostsByUser = async (user: IPayload, limit: string, page: string): Promise<IPagedResult<IPost>> => {
    const paginationLimit = parseInt(limit) || 10;
    const paginationPage = parseInt(page) || 1;

    return this.postRepo.getPostsByUser(user.id.toString(), paginationLimit, paginationPage)
  }

  public getAll = async (limit: string, page: string): Promise<IPagedResult<IPost>> => {
    const paginationLimit = parseInt(limit) || 10;
    const paginationPage = parseInt(page) || 1;

    return this.repo.getAll(paginationLimit, paginationPage)
  }
}

export default UserService