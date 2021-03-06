import { NextFunction, Request, Response } from 'express';
import { secret } from '../config/config';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export interface RequestWithUser extends Request {
  user: object | string;
}

export async function isAuthenticated(req: RequestWithUser, res: Response, next: NextFunction): Promise<Response | void> {
  try {

    if (!req.headers.authorization) {
      return res.status(401).json({
        error: {
          status: 403,
          message: 'La petición no tiene la cabecera de autenticación'
        }
      });
    }

    const token = req.headers.authorization.toString().replace('Bearer ', '');

    const tokenExp = jwt.decode(token, secret).exp;

    if (tokenExp <= moment().unix()) {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'El token ha expirado'
        }
      });
    }

    const payload: object | string | any = jwt.verify(token, secret);

    req.user = payload.user;

    return next();

  } catch (e) {
    return res.status(401).json({
      error: {
        status: 404,
        message: 'El token no es válido'
      }
    });
  }
}
