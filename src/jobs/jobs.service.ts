import { PrismaService } from './../../prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateJobsDto } from './dto/create-jobs.dto';

@Injectable()
export class JobsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
        try {
            return await this.prismaService.jobs.findMany();
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }   
}