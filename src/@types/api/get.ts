import { Prisma } from "@prisma/client";

export type Pagination = {
    where?: any;
    page?: number;
    limit?: number;
}