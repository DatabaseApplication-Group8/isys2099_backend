import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { appointments, jobs, Prisma, schedules, staff, users } from '@prisma/client';


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
  async findOneBySalary(salary: number) {
    try {
      const data = await this.prisma.staff.findMany({
        where: {
          salary: {
            lt: salary
          },
        }
      })
      return {
        data,
        status: 200,
        message: `Successfully find ${data.length} staff with salary <= $${salary}`
      }

    } catch (err) {
      throw Error("Unsuccess" + err.message)
    }

  }

  // add new staff
  async addNewStaff(createStaffDto: CreateStaffDto): Promise<void> {
    try {

      // const isJobIdExist = await this.prisma.jobs.findUnique({
      //   where: {
      //     job_id: typeof createStaffDto.job_id === 'number' ? createStaffDto.job_id : parseInt(createStaffDto.job_id),
      //   }
      // })

      // const isDeptIDExist = await this.prisma.departments.findUnique({
      //   where: {
      //     dept_id: typeof createStaffDto.dept_id === 'number' ? createStaffDto.dept_id : parseInt(createStaffDto.dept_id),
      //   }
      // })
      const departmentId = typeof createStaffDto.dept_id === 'number' ? createStaffDto.dept_id : parseInt(createStaffDto.dept_id);
      if (isNaN(departmentId)) {
        throw new Error(`Invalid department ID provided. ${createStaffDto.dept_id} is not a number`);
      }

      const isDeptIDExist = await this.prisma.departments.findUnique({
        where: {
          dept_id: departmentId,
        }
      });

      // const isManagerIDExist = await this.prisma.staff.findUnique({
      //   where: {
      //     s_id: typeof createStaffDto.manager_id === 'number' ? createStaffDto.manager_id : parseInt(createStaffDto.manager_id),
      //   }
      // })

      // if (!isJobIdExist) {
      //   throw new Error(`Job ID ${createStaffDto.job_id} does not exist`)
      // }

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
          qualifications: createStaffDto.qualifications,
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

  async remove(s_id: number): Promise<boolean> {
    try {
      await this.prisma.staff.delete({
        where: {
          s_id: s_id
        }
      })
      return true;
    } catch (error) {
      throw new Error("Failed to delete staff: " + error.message);
    }
  }

  // listStaffByName
  async listStaffByName(order: 'asc' | 'desc'): Promise<staff[]> {
    try {
      const data = await this.prisma.staff.findMany({
        include: {
          users: true  // Make sure to include users to access the Fname field
        },
        orderBy: {
          users: {
            Fname: order  // Ensure this is supported by your Prisma Client version
          }
        }
      });
      return data;  // Return the fetched data
    } catch (error) {
      console.error("Failed to list staff by name: ", error);
      throw new Error("Failed to list staff by name: " + error.message);
    }
  }

  // list staff but exclude current user
  async listStaffExludeCurrentUser(sId : number): Promise<staff[]> {
    try {
      const data = await this.prisma.staff.findMany({
        include: {
          users: true
        },
        where: {
         NOT: {
          s_id: sId
         }
        }
      });
      return data;
    } catch (error) {
      throw new Error("Failed to list staff excluding current user: " + error.message);
    }
  }

  // List Staff By department
  async listStaffByDepartment(dept_id: number): Promise<staff[]> {
    try {
      const data = await this.prisma.staff.findMany({
        where: {
          dept_id: dept_id,
        }
      });
      return data;
    } catch (error) {
      throw new Error("Failed to list staff by department");
    }
  }
  
  async listExistingJobs(): Promise<jobs[]> {
    try {
      const data = await this.prisma.jobs.findMany();
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ???
  // update staff Info
  async updateStaffInfo(s_id: number, UpdateStaffDto: UpdateStaffDto): Promise<void> {
    try {
      await this.prisma.staff.update({
        where: {
          s_id: s_id,
        },
        data: {
          salary: UpdateStaffDto.salary,
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

      // check if the staff exist or not
      const staffSchedule = await this.prisma.staff.findUnique({
        where: {
          s_id: s_id
        },
        select: {
          schedules: true,
          appointments: true
        }
      })

      // if staff does not exist
      if (!staffSchedule) {
        throw new Error("Staff does not exist")
      }

      // Check for clashes in existing schedules
      // staffSchedule.schedules.forEach(element => {
      //   if (
      //     (newSchedules.start_time >= element.start_time && newSchedules.start_time < element.end_time) ||
      //     (newSchedules.end_time > element.start_time && newSchedules.end_time <= element.end_time) ||
      //     (newSchedules.start_time <= element.start_time && newSchedules.end_time >= element.end_time)
      //   ) {
      //     throw new Error("Schedule clash detected with existing schedules");
      //   }
      // });
      const combinedEvents = [...staffSchedule.schedules, ...(staffSchedule.appointments || [])];
        combinedEvents.forEach(element => {
            if (
                (newSchedules.start_time >= element.start_time && newSchedules.start_time < element.end_time) ||
                (newSchedules.end_time > element.start_time && newSchedules.end_time <= element.end_time) ||
                (newSchedules.start_time <= element.start_time && newSchedules.end_time >= element.end_time)
            ) {
                throw new Error("Schedule clash detected with existing schedules/appointments");
            }
        });
      await this.prisma.schedules.upsert({
        where: {
          scheduled_id: newSchedules.scheduled_id ?? -1
        },
        update: newSchedules,
        create: {
          ...newSchedules,
          s_id: s_id
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


  async getStaffProfile(id: number) : Promise<any> {
    try {
      const staff = await this.prisma.staff.findUnique({
        where: {
          s_id: id,
        },
        select: {
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
              role: true,
            },
          },
          jobs: true,
          departments: true,
          qualifications: true,
          salary: true,
        },
      });
      return staff;
    } catch (error) {
      throw new Error("Failed to get staff profile: " + error.message);
    }
  }


}
