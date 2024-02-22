import { Injectable, NestMiddleware } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response } from "src/shared/response";

config()
const { SECRET } = process.env;

if (!SECRET) throw new Error("SECRET is not defined");

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
    use(req: Request, res: ExpressResponse, next: NextFunction) {
        try {
            const bearerHeader = req.headers.authorization;

            if (!bearerHeader) {
                return res.status(401).send(new Response(false, {}, "Unauthorized"));
            }

            const token = bearerHeader.replace('Bearer ', '');
            const data = verify(token, SECRET);
            
            res.locals.user = data;

            next();
        } catch (error) {
            return res.status(401).send(new Response(false, {}, "Unauthorized"));
        }
    }
}