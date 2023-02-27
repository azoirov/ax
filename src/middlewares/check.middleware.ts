import { IPayload } from '@interfaces/payload.interface';
import UnauthorizedError from '@errors/unauthorized.error';
import ErrorCode from '@enums/error-code.enum';
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { IRequest } from '@interfaces/request.interface';
import { NextFunction, Response } from 'express';
import UserService from '@domain/user/user.service';

export const verify = (token: string, secret: string, ignoreExpiration?: boolean): Promise<IPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { ignoreExpiration: ignoreExpiration || false }, (err: VerifyErrors | null, tokenPayload: IPayload) => {
      if (err) return reject(new UnauthorizedError());

      resolve(tokenPayload);
    });
  });
};

export const checkToken = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userService = new UserService();

    const token: string = req.headers['authorization']?.split(' ')[1];

    if (!token) throw new UnauthorizedError(ErrorCode.TokenNotExists);

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const payload: IPayload = await verify(token, ACCESS_TOKEN_SECRET);

    await userService.getById(payload.id);

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
