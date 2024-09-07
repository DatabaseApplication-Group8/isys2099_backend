import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePatientMongoDBDto } from './dto/create-patient-mongodb.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('patient')
@ApiTags('Patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll(@Query('name') name: string) {
    return this.patientService.findAll(name);
  }

  @Post('/mongodb')
  @UseInterceptors(
    FilesInterceptor('diag_img', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  createPatientNote(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPatientMongoDBDto: CreatePatientMongoDBDto,
  ) {
    const filesName = files.map(
      (file) => file.destination + '/' + file.filename,
    );
    return this.patientService.createPatientNote(
      createPatientMongoDBDto,
      filesName,
    );
  }

  @Get('/mongodb/:id')
  getPatientMongoDb(@Param('id') id: string){
    return this.patientService.getPatientMongoDb(id);
  }

  // @Post('/mongodb')
  // createPatientNote(@Body() createPatientMongoDBDto: CreatePatientMongoDBDto) {
  //   return this.patientService.createPatientNote(createPatientMongoDBDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.patientService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
  //   return this.patientService.update(+id, updatePatientDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.patientService.remove(+id);
  // }
}
