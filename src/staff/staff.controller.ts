import { schedules } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateStaffMongoDBDto } from './dto/create-staff-mongodb.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


// Use Case
@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Use Case
  // done
  @Post('add-new-staff')
  addNewStaff(@Body() CreateStaffDto: CreateStaffDto) {
    return this.staffService.addNewStaff(CreateStaffDto);
  }
  // done
  @Get()
  findAll() {
    return this.staffService.findAll();
  }
  // done
  @Get(':number')
  findOneBySalary(@Param('number') number: number) {
    return this.staffService.findOneBySalary(number);
  }

  @Get('list-staff-by-name/:order')
  listStaffByName(@Param('string') order: 'asc' | 'desc') {
    return this.staffService.listStaffByName(order);
  }

  @Get('list-staff-by-department/:dept_id')
  listStaffByDepartment(@Param('number') dept_id: number) {
    return this.staffService.listStaffByDepartment(dept_id);
  }

  @Patch('update-staff-info/:id')
  updateStaffInfo(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffService.updateStaffInfo(+id, updateStaffDto);
  }
  // done
  @Patch('update-schedule/:id')
  updateStaffSchedule(@Param('id') id: string, @Body() schedules: schedules) {
    return this.staffService.updateStaffSchedule(+id, schedules);
  }

  // done
  @Get('schedule/:id')
  viewStaffSchedule(@Param('id') id: number) {
    return this.staffService.viewStaffSchedule(+id);
  }

  // @Post()
  // create(@Body() createStaffDto: CreateStaffDto) {
  //   return this.staffService.create(createStaffDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
  //   return this.staffService.update(+id, updateStaffDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.staffService.remove(+id);
  // }

  @Post('/mongodb')
  @UseInterceptors(
    FilesInterceptor('certificates', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  createStaffMongoDb(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createStaffMongoDBDto: CreateStaffMongoDBDto,
  ) {
    const filesName = files.map(
      (file) => file.destination + '/' + file.filename,
    );
    return this.staffService.createStaffMongoDb(
      createStaffMongoDBDto,
      filesName,
    );
  }

  @Get('/mongodb/:id')
  getStaffMongoDb(@Param('id') id: string){
    return this.staffService.getStaffMongoDb(id);
  }
}
