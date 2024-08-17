import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // SELECT * FROM staff JOIN users ON users.id = staff.s_id
    const data = await this.prisma.staff.findMany({
      include: {
        users: true,
        departments: true,
        jobs: true
      }
    })
    return data;
  }

  // Find staff with salary equals or smaller than number provided
  // SELECT * FROM staff WHERE salary <= 70000
  async findOneBySalary(number: number) {
    try {
      const data = await this.prisma.staff.findMany({
        where: {
          salary: {
            lt: number
          },
        }
      })
      return {
        data,
        status: 200,
        message: `Successfully find ${data.length} staff with salary <= $${number}`
      }

    } catch (err) {
      throw Error("Unsuccess")
    }
    
  }
  
  // create(createStaffDto: CreateStaffDto) {
  //   return 'This action adds a new staff';
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} staff`;
  // }

  // update(id: number, updateStaffDto: UpdateStaffDto) {
  //   return `This action updates a #${id} staff`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} staff`;
  // }
}
