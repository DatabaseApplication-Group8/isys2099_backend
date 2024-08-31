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

  @Post()
  addNewStaff(@Body() CreateStaffDto : CreateStaffDto) {
      return this.staffService.addNewStaff(CreateStaffDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':number')
  findOneBySalary(@Param('number') number: number) {
    return this.staffService.findOneBySalary(number);
  }

  @Get()
  listStaffByName(@Param('string') order : string) {
    return this.staffService.listStaffByName("asc");
  }

  @Get()
  listStaffByDepartment(@Param('string') s_id: number) {
    return this.staffService.listStaffByDepartment(s_id);
  }

  @Patch(':id')
  updateStaffInfo(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.updateStaffInfo(+id, updateStaffDto);
  }


@Get()
viewStaffSchedule(@Param('id') id: number) {
  return this.staffService.viewStaffSchedule(id);
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
