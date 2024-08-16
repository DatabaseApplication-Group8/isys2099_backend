import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const data = await this.prisma.users.findMany()
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByName(name: string) {
    const data = await this.prisma.users.findMany({
      where: {
        OR: [
          {Fname: { contains: name }},
          {Lname: { contains: name }}
        ]
      }
    })

    return {
      data,
      message: "Success!",
      status: 200
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
