import 'reflect-metadata'
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreatePostRepoDto extends CreatePostDto{
  author: Types.ObjectId
}

export class RatePostDto {
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;
}