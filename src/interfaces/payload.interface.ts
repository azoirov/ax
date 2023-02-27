import { Types } from 'mongoose';

export interface IPayload {
  id: Types.ObjectId;
  email: string;
}