import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { hashPasswordHelper } from 'src/helpers/util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  isEmailExist = async (email: string) => {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    const { username, pw, Fname, Minit, Lname, phone, email, sex, birth_date, roles } =
      createUserDto;
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `This ${email} email is exist. PLease enter different email`,
      );
    }

    const hashPassword = await hashPasswordHelper(pw);
    const user = await this.prisma.users.create({
      data: {
        username,
        pw: hashPassword,
        Fname,
        Minit,
        Lname,
        phone,
        email,
        sex,
        birth_date,
        role: roles,
      },
    });
    return {
      id: user.id,
    };
  }

  async findByEmail(email: string){
    return await this.prisma.users.findUnique({
      where:{
        email
      }
    })
  }

  async findAll() {
    // SELECT * FROM users
    const data = await this.prisma.users.findMany();

    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByName(name: string) {
    const data = await this.prisma.users.findMany({
      where: {
        OR: [{ Fname: { contains: name } }, { Lname: { contains: name } }],
      },
    });

    return {
      data,
      message: 'Success!',
      status: 200,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
