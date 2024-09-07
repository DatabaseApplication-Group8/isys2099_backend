import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('appointment')
@ApiTags('Appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('/patient')
  findByPatientId(@Query('id') id: string) {
    return this.appointmentService.findByPatientId(+id);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.appointmentService.findOne(+id);
  // }

  @Patch()
  cancel(@Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.cancel(updateAppointmentDto);
  }


  @Get('/by-date-range/:s_id/:meeting_date')
  async findByDateRange(@Param('s_id') s_id: number , @Param('meeting_date') meeting_date: string) {
    try {
      // console.log("meeting_date: ", meeting_date);
      const meeting_date_converted = new Date(meeting_date);
      meeting_date_converted.setMinutes(meeting_date_converted.getMinutes() - meeting_date_converted.getTimezoneOffset());

      // console.log("meeting_date: ", meeting_date);
      // Validate that both dates are valid and that startDate is not later than endDate
      if (isNaN(meeting_date_converted.getTime())) {
        throw new BadRequestException('Invalid date');
      }



      return this.appointmentService.findAppointmentsByDateRange(+s_id,meeting_date_converted);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
