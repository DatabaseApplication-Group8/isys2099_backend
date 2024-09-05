import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from 'prisma/prisma.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentNote, AppointmentNoteSchema } from './schemas/appointmentNote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppointmentNote.name, schema: AppointmentNoteSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, PrismaService],
})
export class AppointmentModule {}
