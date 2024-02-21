import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { SemanticSearch } from "./dto/semanticSearch.dto";

@Injectable()
export class OpenAiService {
    public constructor(private readonly prismaService: PrismaService) { }

    public async semanticSearch(embedding: number[], trashold = 0.78, limit = 4) {
        await this.prismaService.$queryRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;')

        const res: SemanticSearch[] = await this.prismaService.$queryRawUnsafe(`
            SELECT
                "text",
                1 - ("data"::vector <=> '[${embedding.toString()}]'::vector) AS similarity
            FROM
                "Embedding"
            WHERE
                1 - ("data"::vector <=> '[${embedding.toString()}]'::vector) > ${trashold}
            ORDER BY
                similarity DESC
            LIMIT
                ${limit}
        `);

        return res;
    }
}