import 'reflect-metadata'
import { IsMongoId } from 'class-validator';

export class IdDto {
  @IsMongoId()
  id: string;
}