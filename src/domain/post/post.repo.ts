import postModel from '@domain/post/post.model';
import { CreatePostRepoDto } from '@domain/post/post.dto';
import { IPost } from '@domain/post/post.interface';
import { IPagedResult } from '@interfaces/pagination.interface';
import PostPipeline from '@domain/post/post.pipeline';
import { Types } from 'mongoose';

class PostRepo {
  public model = postModel;
  public pipeline = new PostPipeline()

  public create = async (data: CreatePostRepoDto): Promise<IPost> => {
    return this.model.create(data);
  };

  public getAll = async (limit: number, page: number): Promise<IPagedResult<IPost>> => {
    const pipeline = this.pipeline.getPosts(limit, page)

    const result = await this.model.aggregate(pipeline);

    await this.model.populate(result[0].data, "author")

    return result[0]
  };

  public getPostsByUser = async (userId: string, limit: number, page: number): Promise<IPagedResult<IPost>> => {
    const pipeline = this.pipeline.getPostsByUser(userId, limit, page);

    const result = await this.model.aggregate(pipeline);

    await this.model.populate(result[0].data, 'author')

    return result[0]
  }

  public getById = async (id: string): Promise<IPost> => {
    const pipeline = this.pipeline.getById(id);

    const result = await this.model.aggregate(pipeline);

    await this.model.populate(result[0], 'author')

    return result[0]
  };

  public getUserRate = async (userId: string): Promise<any> => {
    const pipeline = this.pipeline.getUserRate(userId);

    const result = await this.model.aggregate(pipeline)

    return result[0]
  }

  public removeRate = async (postId: Types.ObjectId, userId: Types.ObjectId): Promise<void> => {
    await this.model.findByIdAndUpdate(postId, {
      $pull: {
        rates: {
          user: userId,
        }
      }
    })
  }

  public ratePost = async (postId: Types.ObjectId, userId: Types.ObjectId, rate: number): Promise<void> => {
    await this.model.findByIdAndUpdate(postId, {
      $push: {
        rates: {
          user: userId,
          rate
        }
      }
    })
  }
}

export default PostRepo;