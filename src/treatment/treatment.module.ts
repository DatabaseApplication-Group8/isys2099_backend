import { Module } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { TreatmentController } from './treatment.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [TreatmentController],
  providers: [TreatmentService, PrismaService],
})
export class TreatmentModule {}
