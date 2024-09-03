import { PrismaService } from './../../prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
        try {
            return await this.prismaService.departments.findMany();
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }   

    async findDepartmentIdByName(dept_name: string) {
        try {
            return await this.prismaService.departments.findFirst({
                where: {
                    dept_name : dept_name
                }
            });
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}