import { schedules } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';


// Use Case
@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Use Case
  // done
  @Post("add-new-staff")
  addNewStaff(@Body() CreateStaffDto : CreateStaffDto) {
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
  listStaffByName(@Param('string') order : 'asc' | 'desc') {
    return this.staffService.listStaffByName(order);
  }

  @Get('list-staff-by-department/:dept_id')
  listStaffByDepartment(@Param('number') dept_id: number) {
    return this.staffService.listStaffByDepartment(dept_id);
  }

  @Patch('update-staff-info/:id')
  updateStaffInfo(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
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

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.staffService.remove(+id);
  // }
}
