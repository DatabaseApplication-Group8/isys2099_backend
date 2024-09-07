import { treatments } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';

@Controller('treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Post()
  create(@Body() createTreatmentDto: CreateTreatmentDto) {
    return this.treatmentService.create(createTreatmentDto);
  }

  @Get('/user')
  findByUserId(@Query('id') id: string) {
    return this.treatmentService.findByUserId(+id);
  }

  @Get('/patient')
  findByPatientId(@Query('id') id: string) {
    return this.treatmentService.findByPatientId(+id);
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

      return this.treatmentService.findTreatmentsByDateRange(startDate, endDate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Get('/by-treatment-date/:s_id/:treatment_date')
    async findTreatmentsMeetingDate(@Param('s_id') s_id : number,@Param('treatment_date') treatment_date: string) {
      try {
        // console.log("meeting_date: ", meeting_date);
        const tretment_date_converted = new Date(treatment_date);
        tretment_date_converted.setMinutes(tretment_date_converted.getMinutes() - tretment_date_converted.getTimezoneOffset());
    
        console.log("treatment_date: ", treatment_date);
        // Validate that both dates are valid and that startDate is not later than endDate
        if (isNaN(tretment_date_converted.getTime())) {
          throw new BadRequestException('Invalid date');
        }
    
    
        return this.treatmentService.findTreatmentsMeetingDate(+s_id,tretment_date_converted);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.treatmentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTreatmentDto: UpdateTreatmentDto) {
  //   return this.treatmentService.update(+id, updateTreatmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.treatmentService.remove(+id);
  // }
}
