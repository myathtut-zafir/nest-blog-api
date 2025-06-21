import {
  Controller,
  Param,
  Delete,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/iam/auth/jwt-payload.interface';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Request() req: ExpressRequest) {
    const userPayload = req.user as JwtPayload;

    return this.usersService.getProfile(userPayload.userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
