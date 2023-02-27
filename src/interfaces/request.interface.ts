import { Request } from 'express';
import { IPayload } from '@interfaces/payload.interface';

export interface IRequest extends Request {
  user: IPayload
}