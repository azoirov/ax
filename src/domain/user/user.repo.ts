import userModel from '@domain/user/user.model';
import { CreateUserDto } from '@domain/user/user.dto';
import { IUser } from '@domain/user/user.interface';
import { Types } from 'mongoose';
import { IPagedResult } from '@interfaces/pagination.interface';
import { IPost } from '@domain/post/post.interface';
import UserPipeline from '@domain/user/user.pipeline';

class UserRepo {
  public model = userModel;
  public pipeline = new UserPipeline()

  public create = async (data: CreateUserDto):Promise<IUser> => {
    return this.model.create(data)
  }

  public getByEmail = async (email: string): Promise<IUser> => {
    return this.model.findOne({
      email
    })
  }

  public getById = async (id: Types.ObjectId): Promise<IUser> => {
    return this.model.findById(id).lean()
  }

  public getAll = async (limit: number, page: number): Promise<IPagedResult<IPost>> => {
    const pipeline = this.pipeline.getUsers(limit, page)

    const result = await this.model.aggregate(pipeline);

    return result[0]
  };
}

export default UserRepo