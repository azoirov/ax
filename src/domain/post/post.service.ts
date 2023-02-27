import PostRepo from '@domain/post/post.repo';
import { CreatePostDto } from '@domain/post/post.dto';
import { IPost } from '@domain/post/post.interface';
import NotFoundError from '@errors/not-found.error';
import ErrorCode from '@enums/error-code.enum';
import { Types } from 'mongoose';
import { IPagedResult } from '@interfaces/pagination.interface';
import { IPayload } from '@interfaces/payload.interface';

class PostService {
  public repo = new PostRepo();

  public create = async (data: CreatePostDto, author: Types.ObjectId): Promise<IPost> => {
    return this.repo.create({ ...data, author })
  }

  public getAll = async (limit: string, page: string): Promise<IPagedResult<IPost>> => {
    const paginationLimit = parseInt(limit) || 10;
    const paginationPage = parseInt(page) || 1;

    return this.repo.getAll(paginationLimit, paginationPage)
  }

  public getById = async (id: string): Promise<IPost> => {
    const post = await this.repo.getById(id);
    if(!post) throw new NotFoundError(ErrorCode.PostNotFound)

    return post
  }

  public ratePost = async (postId: string, user: IPayload, rate: number): Promise<void> => {
    const userId = new Types.ObjectId(user.id);
    const id = new Types.ObjectId(postId);

    const post = await this.getById(postId);

    const isAlreadyRated = post.rates.find(rate => rate.user.toString() === userId.toString());
    if (isAlreadyRated) await this.repo.removeRate(id, userId)

    return this.repo.ratePost(id, userId, rate)
  }
}

export default PostService