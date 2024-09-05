import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { hashPasswordHelper } from 'src/helpers/util';
import aqp from 'api-query-params';
import { PatientService } from 'src/patient/patient.service';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { StaffService } from 'src/staff/staff.service';
import { CreateStaffDto } from 'src/staff/dto/create-staff.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private patientService: PatientService,
    private staffService: StaffService,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user) return true;
    return false;
  };
  isUsernameExist = async (username: string) => {
    const user = await this.prisma.users.findUnique({
      where: {
        username,
      },
    });
    if (user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    var {
      username,
      pw,
      Fname,
      Minit,
      Lname,
      phone,
      email,
      sex,
      birth_date,
      roles,
    } = createUserDto;
    if (sex) {
      if (sex === 'female') {
        sex = 'F';
      } else if (sex === 'male') {
        sex = 'M';
      } else {
        sex = 'O';
      }
    }
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `This ${email} email is exist. Please enter different email`,
      );
    }

    const isUsernameExist = await this.isUsernameExist(username);
    if (isUsernameExist) {
      throw new BadRequestException(
        `This ${username} username is exist. Please enter different username`,
      );
    }

    const hashPassword = await hashPasswordHelper(pw);

    const user = await this.prisma.users.create({
      data: {
        username,
        pw: hashPassword,
        Fname,
        Minit,
        Lname,
        phone,
        email,
        sex,
        birth_date,
        role: roles,
      },
    });

    if (createUserDto.roles === 3) {
      const newPatient: CreatePatientDto = {
        p_id: user.id,
        address: createUserDto.address,
        allergies: createUserDto.allergies,
      };
      await this.patientService.create(newPatient);
    } else if (createUserDto.roles === 2) {
      const newStaff: CreateStaffDto = {
        s_id: user.id,
        // job_id: createUserDto.job_id,
        job_id: createUserDto.job_id,
        dept_id: createUserDto.dept_id,
        // manager_id: createUserDto.manager_id,
        manager_id: createUserDto.manager_id,
        qualifications: createUserDto.qualifications,
        salary: createUserDto.salary,
      };
      console.log(newStaff);
      await this.staffService.addNewStaff(newStaff);
    }
    return {
      id: user.id,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  // async findAll(name?: string) {
  //   const id = !isNaN(Number(name)) ? Number(name) : undefined;
  //   const data = await this.prisma.users.findMany({
  //     where: {
  //       OR: [
  //         { id: id },
  //         {
  //           Fname: {
  //             contains: name,
  //           },
  //         },
  //         {
  //           Lname: {
  //             contains: name,
  //           },
  //         },
  //       ],
  //     },
  //     select: {
  //       id: true,
  //       username: true,
  //       Fname: true,
  //       Minit: true,
  //       Lname: true,
  //       phone: true,
  //       email: true,
  //       sex: true,
  //       birth_date: true,
  //     },
  //   });

  //   return { data: data, status: 200, total: data.length };
  // }

  async findAllStaff() {
    return await this.prisma.users.findMany({
      where: {
        role: 2,
      },
      select: {
        id: true,
        Fname: true,
      },
    });
  }

  // async updateUserInfo(userId : number, updateUserDto : UpdateUserDto) : Promise<void>{
  //   const updatedUserInfo = await this.prisma.users.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       Lname: updateUserDto.Lname,
  //       Fname : updateUserDto.Fname,
  //       Minit : updateUserDto.Minit,
  //       phone : updateUserDto.phone,
  //       birth_date : updateUserDto.birth_date,
  //       email : updateUserDto.email,
  //        // address : updateUserDto.address,
  //       if 
  //     }
  //   })
  // }

  // async findOneByName(name: string) {
  //   const data = await this.prisma.users.findMany({
  //     where: {
  //       OR: [{ Fname: { contains: name } }, { Lname: { contains: name } }],
  //     },
  //   });

  //   return {
  //     data,
  //     message: 'Success!',
  //     status: 200,
  //   };
  // }
}
