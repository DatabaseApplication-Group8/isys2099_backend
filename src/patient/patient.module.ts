import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PrismaService } from 'prisma/prisma.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorNote, DoctorNoteSchema } from './schemas/doctorNote.schema';
import { Patient, PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorNote.name, schema: DoctorNoteSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService, PrismaService],
  exports: [PatientService],
})
export class PatientModule {}
