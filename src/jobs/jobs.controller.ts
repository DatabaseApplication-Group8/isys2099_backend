import { departments } from './../../node_modules/.prisma/client/index.d';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, jobs } from '@prisma/client';
import { CreateJobsHistoryDto } from './dto/create-jobs-history';

@Controller('jobs')
@ApiTags('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

//   @Post()
//   create(@Body() createDepartmentDto: CreateDepartmentDto) {
//     return this.departmentService.create(createDepartmentDto);
//   }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Post('add-new-jobs-history')
  addNewJobsHistory(@Body() createJobsHistoryDto: CreateJobsHistoryDto) {
    return this.jobsService.addNewJobsHistory(createJobsHistoryDto);
  }
//   @Get('find-department-id-by-name/:dept_name')
//     findDepartmentIdByName(@Param('dept_name') dept_name: string) {
//         return this.departmentService.findDepartmentIdByName(dept_name);
//     }

}
