import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll(@Query('name') name: string) {
  //   return this.userService.findAll(name);
  // }

  @Public()
  @Get('/staff')
  findAllStaff() {
    return this.userService.findAllStaff();
  }

  @Patch('update-staff/:id/:role')
  update(@Param('id') id: string, @Param('role') role: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, +role, updateUserDto);
  }

  // @Get(':name')
  // findOneByName(@Param('name') name: string) {
  //   return this.userService.findOneByName(name);
  // }
}
