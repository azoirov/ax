import { Document, model, Schema } from 'mongoose';
import { IUser } from '@domain/user/user.interface';

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default model<IUser & Document>("user", userSchema)