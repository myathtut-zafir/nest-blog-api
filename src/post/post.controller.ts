import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';
import { PostOwnerGuard } from './guards/post-owner.guard';
import { JwtPayload } from 'src/iam/auth/jwt-payload.interface';
import { UpdatePostDto } from './dto/update-post.dto';

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
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    // Since PostOwnerGuard already verified ownership,
    // we can directly call the service without additional checks
    return this.postService.updateSimple(id, updatePostDto);
  }
}
