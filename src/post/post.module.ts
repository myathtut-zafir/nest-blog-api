import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostOwnerGuard } from './guards/post-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostOwnerGuard],
  controllers: [PostController],
})
export class PostModule {}
