import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateAppointmentNoteDto } from './dto/create-appointment-note.dto';

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

  @Post('/note')
  createNote(@Body() createAppointmentNoteDto: CreateAppointmentNoteDto) {
    return this.appointmentService.createNote(createAppointmentNoteDto);
  }

  @Get('/note/:id')
  findNoteByAppointmentId(@Param('id') id: string){
    return this.appointmentService.findNoteByAppointmentId(id);
  }

  @Get('/by-date-range/:start/:end')
  async findByDateRange(@Param('start') start: string, @Param('end') end: string) {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Validate that both dates are valid and that startDate is not later than endDate
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
        throw new BadRequestException('Invalid start or end date, or start date is later than end date.');
      }

      return this.appointmentService.findTreatmentsByDateRange(startDate, endDate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    
  }
}
