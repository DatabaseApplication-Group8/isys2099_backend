import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}
  async create(createPatientDto: CreatePatientDto) {
    const newPatient = await this.prisma.patients.create({
      data: createPatientDto
    })
    return {
      data: newPatient,
      status: 201,
      message: `Successfully create new patient`,
    };
  }

  findAll() {
    return `This action returns all patient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
