import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PatientService } from 'src/patient/patient.service';
import { StaffService } from 'src/staff/staff.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PatientService, StaffService],
  exports: [UserService],
})
export class UserModule {}
