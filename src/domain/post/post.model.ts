import { Document, model, Schema, Types } from 'mongoose';
import { IPost } from '@domain/post/post.interface';

const postRateSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "user"
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
})

const postSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  rates: {
    _id: false,
    type: [postRateSchema]
  }
}, {
  timestamps: true
})

export default model<IPost & Document>("post", postSchema)