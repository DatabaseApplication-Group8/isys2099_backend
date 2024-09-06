import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { GetTreatmentDto } from './dto/get-treatment.dto';

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

  // @Get()
  // findAll() {
  //   return this.treatmentService.findAll();
  // }

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

  @Post('/patient/duration')
  findByPatientIdInGivenDuration(@Body() getTreatmentDto: GetTreatmentDto) {
    return this.treatmentService.findByPatientIdInGivenDuration(
      getTreatmentDto,
    );
  }
}
