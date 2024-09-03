import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}
  async create(createPatientDto: CreatePatientDto) {
    
    const newPatient = await this.prisma.patients.create({
      data: createPatientDto,
    });
    return {
      data: newPatient,
      status: 201,
      message: `Successfully create new patient`,
    };
  }

  async findAll(name?: string) {
    const id = !isNaN(Number(name)) ? Number(name) : undefined;

    const whereClause = name
      ? {
          OR: [
            { p_id: id }, // Search by patient ID if `name` is a number
            {
              users: {
                Fname: {
                  contains: name, // Search by first name
                },
              },
            },
            {
              users: {
                Lname: {
                  contains: name, // Search by last name
                },
              },
            },
            {
              users: {
                Minit: {
                  contains: name, // Search by middle initial
                },
              },
            },
          ],
        }
      : {};

    const data = await this.prisma.patients.findMany({
      where: whereClause, // Apply search conditions only if `name` is provided
      select: {
        p_id: true, // Select specific fields from patients
        users: {
          select: {
            id: true,
            username: true,
            Fname: true,
            Minit: true,
            Lname: true,
            phone: true,
            email: true,
            sex: true,
            birth_date: true,
            pw: false, // Ensure that pw is not selected
          },
        },
      },
    });

    return { data: data, status: 200, total: data.length };
  }

  // findAll() {
  //   return `This action returns all patient`;
  // }

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
