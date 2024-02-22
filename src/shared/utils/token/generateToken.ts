import { User } from "@prisma/client";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";

config();
const { SECRET } = process.env;
if (!SECRET) throw new Error('No secret provided');

export function generateToken(user: Omit<User, 'password'>) {
    const token = sign({...user, password: ''}, String(SECRET), { expiresIn: '12h' })
    return token;
}