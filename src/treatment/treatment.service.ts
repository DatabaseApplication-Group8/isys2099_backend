import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TreatmentService {
  constructor(private prisma: PrismaService) {}
  async create(createTreatmentDto: CreateTreatmentDto) {
    createTreatmentDto.treatment_date = new Date(
      createTreatmentDto.treatment_date,
    );
    const newTreatment = await this.prisma.treatments.create({
      data: createTreatmentDto,
    });

    return {
      data: newTreatment,
      status: 201,
      message: `Successfully book an new treatment on ${createTreatmentDto.treatment_date}`,
    };
  }

  async findByUserId(id: number) {
    const treatments = await this.prisma.treatments.findMany({
      where: {
        p_id: id,
      },
    });
    return treatments;
  }

  async findByPatientId(id: number) {
    const isExist = await this.prisma.patients.findUnique({
      where: {
        p_id: id,
      },
    });
    if (isExist) {
      return await this.prisma.treatments.findMany({
        where: {
          p_id: id,
        },
        select: {
          t_id: true,
          p_id: true,
          doctor_id: true,
          description: true,
          treatment_date: true,
          start_time: true,
          end_time: true,
          staff: {
            select: {
              users: true,
            },
          },
        },
      });
    } else {
      throw new BadRequestException('Invalid Patient ID');
    }
  }

  // findAll() {
  //   return `This action returns all treatment`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} treatment`;
  // }

  // update(id: number, updateTreatmentDto: UpdateTreatmentDto) {
  //   return `This action updates a #${id} treatment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} treatment`;
  // }
}
