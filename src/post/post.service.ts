import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDetailDto } from './dto/post-detail.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: number) {
    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.slug = createPostDto.slug;
    post.published = createPostDto.published || false;
    post.featuredImage = createPostDto.featuredImage || null;
    post.authorId = authorId;

    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find();
  }

  async findOne(id: number): Promise<PostDetailDto | null> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      return null;
    }

    return plainToClass(PostDetailDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    return this.postRepository.delete(id);
  }
}
