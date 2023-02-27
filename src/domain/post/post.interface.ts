import { Types } from "mongoose";
import { IUser } from "@domain/user/user.interface";

export interface IPostRate {
    user: Types.ObjectId | IUser,
    rate: number;
}

export interface IPost {
    _id: Types.ObjectId;
    title: string;
    content: string;
    author: Types.ObjectId | IUser
    rates: IPostRate[]
}