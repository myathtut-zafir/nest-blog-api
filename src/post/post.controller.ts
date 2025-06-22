import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/iam/auth/jwt-payload.interface';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.postService.create(createPostDto, req.user.userId);
  }
}
