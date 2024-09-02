import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, schedules, staff } from '@prisma/client';


// repo
@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) { }

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

  // add new staff
  // async addNewStaff(createStaffDto: CreateStaffDto): Promise<void> {
  //   try {
  //     await this.prisma.staff.create({
  //       data: {
  //         s_id: typeof createStaffDto.s_id === 'number' ? createStaffDto.s_id : parseInt(createStaffDto.s_id),
  //         salary: createStaffDto.salary,
  //         dept_id: typeof createStaffDto.dept_id === 'number' ? createStaffDto.dept_id : parseInt(createStaffDto.dept_id),
  //         job_id: typeof createStaffDto.job_id == 'number' ? createStaffDto.job_id : parseInt(createStaffDto.job_id),
  //         manager_id: typeof createStaffDto.manager_id === 'number' ? createStaffDto.manager_id : parseInt(createStaffDto.manager_id),
  //         qualifications: createStaffDto.qualifications
  //       }
  //     });
  //   } catch (error) {
  //     throw new Error("Failed to add new staff member");
  //   }
  // }
  async addNewStaff(createStaffDto: CreateStaffDto): Promise<void> {
    try {

      const isJobIdExist = await this.prisma.jobs.findUnique({
        where: {
          job_id: typeof createStaffDto.job_id === 'number' ? createStaffDto.job_id : parseInt(createStaffDto.job_id),
        }
      })

      const isDeptIDExist = await this.prisma.departments.findUnique({
        where: {
          dept_id: typeof createStaffDto.dept_id === 'number' ? createStaffDto.dept_id : parseInt(createStaffDto.dept_id),
        }
      })

      const isManagerIDExist = await this.prisma.staff.findUnique({
        where: {
          s_id: typeof createStaffDto.manager_id === 'number' ? createStaffDto.manager_id : parseInt(createStaffDto.manager_id),
        }
      })

      if (!isJobIdExist) {
        throw new Error(`Job ID ${createStaffDto.job_id} does not exist`)
      }

      if (!isDeptIDExist) {
        throw new Error(`Department ID ${createStaffDto.dept_id} does not exist`)
      }

      // if (!isManagerIDExist){
      //   throw new Error(`Manager ID ${createStaffDto.manager_id} does not exist`)
      // }

      await this.prisma.staff.create({
        data: {
          s_id: typeof createStaffDto.s_id === 'number' ? createStaffDto.s_id : parseInt(createStaffDto.s_id),
          salary: createStaffDto.salary,
          dept_id: typeof createStaffDto.dept_id === 'number' ? createStaffDto.dept_id : parseInt(createStaffDto.dept_id),
          job_id: typeof createStaffDto.job_id === 'number' ? createStaffDto.job_id : parseInt(createStaffDto.job_id),
          manager_id: typeof createStaffDto.manager_id === 'number' ? createStaffDto.manager_id : parseInt(createStaffDto.manager_id),
          qualifications: createStaffDto.qualifications
        }
      });
    } catch (error) {
      console.error("Failed to add new staff member: ", error);
      // Optionally, log specific error details if Prisma throws known error types
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Error details:", {
          code: error.code,
          meta: error.meta
        });
      }
      throw new Error("Failed to add new staff member: " + error.message);
    }
  }

  // listStaffByName
  async listStaffByName(order: 'asc' | 'desc'): Promise<void> {
    try {
      const data = await this.prisma.staff.findMany({
        orderBy: {
          users: {
            Fname: order
          }
        }
      })
    } catch (error) {
      throw new Error("Failed to list staff by name");
    }
  }

  // List Staff By department
  async listStaffByDepartment(dept_id: number): Promise<void> {
    try {
      const data = await this.prisma.staff.findMany({
        where: {
          dept_id: dept_id,
        }
      })
    } catch (error) {
      throw new Error("Failed to list staff by department");
    }
  }


  // update staff Info
  async updateStaffInfo(s_id: number, UpdateStaffDto: UpdateStaffDto): Promise<void> {
    try {
      await this.prisma.staff.update({
        where: {
          s_id: s_id,
        },
        data: {
          salary: UpdateStaffDto.salary,
          dept_id: UpdateStaffDto.dept_id,
          job_id: UpdateStaffDto.job_id,
          manager_id: UpdateStaffDto.manager_id,
          qualifications: UpdateStaffDto.qualifications
        }
      })

    } catch (error) {
      throw new Error("Failed to update staff info");
    }
  }

  async viewStaffSchedule(s_id: number): Promise<schedules[]> {
    try {
      var schedule = await this.prisma.staff.findUnique({
        where: {
          s_id: s_id,
        },
        select: {
          schedules: true
        }
      }
      )
      return schedule.schedules

    }
    catch (error) {
      console.error("Failed to add new staff member: ", error);
      // Optionally, log specific error details if Prisma throws known error types
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Error details:", {
          code: error.code,
          meta: error.meta
        });
      }
      throw new Error("Failed to add new staff member: " + error.message);
    }
  }

  // Update staff schedule
  async updateStaffSchedule(s_id: number, newSchedules: schedules): Promise<void> {
    try {

      //check clash schedule

      const existingSchedule = await this.prisma.staff.findUnique({
        where: {
          s_id: s_id
        },
        select:{
          schedules: true
        }
      })
      
      if (!existingSchedule || !existingSchedule.schedules) {
        throw new Error("No schedule found")
      }

      const existingPatientAppointment = await this.prisma.staff.findUnique({
        where :{
          s_id : s_id
        },
        select:{
          appointments: true
        }
      })

      if (!existingPatientAppointment || !existingPatientAppointment.appointments){
        throw new Error("No appointment found")
      }

      // check if clash with existing staff's schedule
      existingSchedule.schedules.forEach(element => {
        if (element.start_time === newSchedules.start_time 
          || element.end_time === newSchedules.end_time 
          || element.start_time > newSchedules.start_time && element.end_time < newSchedules.end_time
          || element.start_time > newSchedules.start_time && element.start_time < newSchedules.end_time
          || element.end_time > newSchedules.start_time && element.end_time < newSchedules.end_time
          || element.start_time > newSchedules.start_time && element.end_time > newSchedules.end_time) {
          throw new Error("Clash schedule")
        }
      });
      
      // check if clash with existing patient's appointment
      existingSchedule.schedules.forEach(element => {
        if (element.start_time === newSchedules.start_time 
          || element.end_time === newSchedules.end_time 
          || element.start_time > newSchedules.start_time && element.end_time < newSchedules.end_time
          || element.start_time > newSchedules.start_time && element.start_time < newSchedules.end_time
          || element.end_time > newSchedules.start_time && element.end_time < newSchedules.end_time
          || element.start_time > newSchedules.start_time && element.end_time > newSchedules.end_time) {
          throw new Error("Clash schedule")
        }
      });

      await this.prisma.staff.update({
        where: {
          s_id: s_id,
        },
        data: {
          schedules: {
            set: [newSchedules]
          }
        }
      })

    } catch (error) {
      console.error("Failed to update staff schedule: ", error);
      // Optionally, log specific error details if Prisma throws known error types
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Error details:", {
          code: error.code,
          meta: error.meta
        });
      }
      throw new Error("Failed to update staff schedule: " + error.message);
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
