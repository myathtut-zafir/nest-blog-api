import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
