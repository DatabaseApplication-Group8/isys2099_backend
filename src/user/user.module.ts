import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PatientService } from 'src/patient/patient.service';
import { StaffService } from 'src/staff/staff.service';
import { StaffModule } from 'src/staff/staff.module';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports:[StaffModule, PatientModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
