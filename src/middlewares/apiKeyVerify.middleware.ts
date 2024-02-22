import { Injectable, NestMiddleware } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response } from "src/shared/response";

config()
const { SECRET } = process.env;

if (!SECRET) throw new Error("SECRET is not defined");

@Injectable()
export class ApiKeyVerifyMiddleware implements NestMiddleware {
    use(req: Request, res: ExpressResponse, next: NextFunction) {
        try {
            console.log(res.locals?.user)
            if (!res.locals?.user?.apiKey) return res.status(401).send(new Response(false, {}, "Api key not found"));
            next();
        } catch (error) {
            return res.status(401).send(new Response(false, {}, "Unauthorized"));
        }
    }
}