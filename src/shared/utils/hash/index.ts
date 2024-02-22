import { createHash } from "crypto";
import { config } from "dotenv";

config();

const { HASHALGORITHM } = process.env;
if (!HASHALGORITHM) throw new Error("SECRET não encontrado nas variáveis de ambiente");

export function generateHash(password: string): string {
    const hash = createHash(HASHALGORITHM);
    hash.update(password);
    return hash.digest("hex");
}