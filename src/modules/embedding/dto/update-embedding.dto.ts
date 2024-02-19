import { PartialType } from '@nestjs/mapped-types';
import { CreateEmbeddingDto } from './create-embedding.dto';

export class UpdateEmbeddingDto extends PartialType(CreateEmbeddingDto) {
    id: number;
    text: string;
}
