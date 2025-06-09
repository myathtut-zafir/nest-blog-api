import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { JwtPayload } from '../../iam/auth/jwt-payload.interface';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as {
      user: JwtPayload;
      params: { id: string };
    };

    const user = request.user;
    const postId = parseInt(request.params.id, 10);

    if (isNaN(postId)) {
      throw new NotFoundException('Invalid post ID');
    }

    // Find the post
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Check if the user is the author
    if (post.authorId !== user.userId) {
      throw new ForbiddenException(
        'You are not authorized to modify this post',
      );
    }

    return true;
  }
}
