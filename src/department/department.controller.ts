import { departments } from './../../node_modules/.prisma/client/index.d';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

//   @Post()
//   create(@Body() createDepartmentDto: CreateDepartmentDto) {
//     return this.departmentService.create(createDepartmentDto);
//   }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get('find-department-id-by-name/:dept_name')
    findDepartmentIdByName(@Param('dept_name') dept_name: string) {
        return this.departmentService.findDepartmentIdByName(dept_name);
    }
}
