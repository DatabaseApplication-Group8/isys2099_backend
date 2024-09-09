import { schedules } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateStaffMongoDBDto } from './dto/create-staff-mongodb.dto';
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

  @Get('find-staff-by-salary:number')
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
    console.log('id', id);
    return this.staffService.updateStaffSchedule(+id, schedules);
  }

  // done
  @Get('schedule/:id')
  viewStaffSchedule(@Param('id') id: number) {
    return this.staffService.viewStaffSchedule(+id);
  }

  @Get('view-staff-schedule-by-date/:id/:schedule_date')
  viewStaffScheduleByDate(
    @Param('id') id: number,
    @Param('schedule_date') schedule_date: string,
  ) {
    try {
      const schedule_date_converted = new Date(schedule_date);
      schedule_date_converted.setMinutes(
        schedule_date_converted.getMinutes() -
          schedule_date_converted.getTimezoneOffset(),
      );
      if (isNaN(schedule_date_converted.getTime())) {
        throw new BadRequestException('Invalid date');
      }

      return this.staffService.viewStaffScheduleByDate(
        +id,
        schedule_date_converted,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list-staff-exclude-current-user/:id')
  listStaffExludeCurrentUser(@Param('id') s_id: number) {
    return this.staffService.listStaffExludeCurrentUser(+s_id);
  }

  @Get('list-existing-jobs')
  listExistingJobs() {
    return this.staffService.listExistingJobs();
  }

  // @Post()
  // create(@Body() createStaffDto: CreateStaffDto) {
  //   return this.staffService.create(createStaffDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
  //   return this.staffService.update(+id, updateStaffDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.staffService.remove(+id);
  }

  @Get('/profile/:id')
  getStaffProfile(@Param('id') id: number) {
    return this.staffService.getStaffProfile(+id);
  }

  @Post('add-new-schedule/:s_id')
  addNewSchedule(@Param('s_id') id: number, @Body() schedules: schedules) {
    return this.staffService.createStaffSchedule(+id, schedules);
  }


















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
  getStaffMongoDb(@Param('id') id: string) {
    return this.staffService.getStaffMongoDb(id);
  }
}
