import { Exclude, Expose, Type } from 'class-transformer';

class AuthorDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}

export class PostDetailDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  slug: string;

  @Expose()
  published: boolean;

  @Expose()
  featuredImage: string | null;

  @Expose()
  authorId: number;

  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
