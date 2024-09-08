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
import { UpdateStaffDto } from 'src/staff/dto/update-staff.dto';

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

  async update(id: number, role: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const { Fname, Minit, Lname, phone, birth_date, email } = updateUserDto;
  
    try {
      // Check if email is being changed and if it's unique
      if (email) {
        const existingUser = await this.prisma.users.findFirst({
          where: {
            email,
            NOT: {
              id: id, // Exclude the current user
            },
          },
        });
  
        if (existingUser) {
          throw new BadRequestException(`Email ${email} is already in use.`);
        }
      }
  
      // Update user information
      await this.prisma.users.update({
        where: { id: id },
        data: { Fname, Minit, Lname, phone, birth_date, email },
      });
      // console.log('updateUserDto:', updateUserDto.job_id);
      // If the user is a staff, update additional staff information
      if (role === 2 && (updateUserDto.qualifications || updateUserDto.salary)) {
        const updateStaffDto: UpdateStaffDto = {
          job_id: updateUserDto.job_id,
          dept_id: updateUserDto.dept_id,
          manager_id: updateUserDto.manager_id,
          qualifications: updateUserDto.qualifications,
          salary: updateUserDto.salary,
        };
  
        await this.staffService.updateStaffInfo(id, updateStaffDto);
      }
  
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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
}



