import { CharacterTextSplitter } from "langchain/text_splitter";
import { chunkSize } from "../../constants/chunk";
import { CreateEmbeddingDto } from "src/modules/embedding/dto/create-embedding.dto";
import OpenAI from "openai";

class EmbeddingText {

    public async splitIntoChunks(text: string) {
        const textSplitter = new CharacterTextSplitter({
            chunkSize,
            chunkOverlap: 200
        }),
            chunks = await textSplitter.splitText(text);

        return chunks;
    }

    public async embeddingText(text: string, apiKey: string) {
        const openai = new OpenAI({
            apiKey
        });
        
        const { data } = await openai.embeddings.create({
            input: text,
            model: "text-embedding-ada-002"
        })

        const response: CreateEmbeddingDto = {
            data: data[0].embedding,
            text
        }

        return response
    }
}

export const embeddingTextUtils = new EmbeddingText();