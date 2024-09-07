import { PrismaService } from './../../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Prisma, appointments } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const meeting_date = createAppointmentDto.meeting_date;
    const startTime: string = createAppointmentDto.start_time.toString();

    const endTime: string = createAppointmentDto.end_time.toString();

    // // const startTime: String = new Date(createAppointmentDto.start_time)
    // //   .toTimeString()
    // //   .split(' ')[0];
    // // const endTime: String = new Date(createAppointmentDto.end_time)
    // //   .toTimeString()
    // //   .split(' ')[0];
    // const meeting_date_formatted: String = new Date(
    //   meeting_date,
    // ).toLocaleDateString();

    // Check appointment clash
    try {
      var appointmentList = await this.prismaService.appointments.findMany({
        where: {
          meeting_date: new Date(meeting_date),
          s_id: createAppointmentDto.s_id,
        },
      });
    } catch (error) {
      throw new Error('Appointment fetch data error');
    }

    for (let appointment of appointmentList) {
      if (appointment.meeting_status === true) {
        const existStartTime: String = new Date(appointment.start_time)
          .toISOString()
          .split('T')[1]
          .split('.')[0];
        const existEndTime: String = new Date(appointment.end_time)
          .toISOString()
          .split('T')[1]
          .split('.')[0];
        // Check if the user have another appointment with the staff on the same day
        if (
          appointment.s_id === createAppointmentDto.s_id &&
          appointment.p_id === createAppointmentDto.p_id
        ) {
          throw new ConflictException(
            `You already have another appointment with this staff on ${meeting_date} from ${existStartTime} to ${existEndTime}.`,
          );
        }
        // Check if the new appointment's time overlaps with any existing appointment
        if (
          (startTime >= existStartTime && startTime < existEndTime) || // Starts during an existing appointment
          (endTime > existStartTime && endTime <= existEndTime) || // Ends during an existing appointment
          (startTime <= existStartTime && endTime >= existEndTime) // Completely overlaps an existing appointment
        ) {
          throw new ConflictException(
            `Appointment clash detected. Please choose a different time slot.`,
          );
        }
      }
    }

    // Check Schedule clash
    try {
      var scheduleList = await this.prismaService.schedules.findMany({
        where: {
          scheduled_date: new Date(meeting_date),
          s_id: createAppointmentDto.s_id,
        },
      });
    } catch (error) {
      throw new Error('Treatment fetch data error');
    }
    for (let schedule of scheduleList) {
      const existStartTime: String = new Date(schedule.start_time)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      const existEndTime: String = new Date(schedule.end_time)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      if (
        (startTime >= existStartTime && startTime < existEndTime) ||
        (endTime > existStartTime && endTime <= existEndTime) ||
        (startTime <= existStartTime && endTime >= existEndTime)
      ) {
        throw new ConflictException(
          `Schedule clash detected from ${startTime} to ${endTime}. This staff already have
           schedule from ${existStartTime} to ${existEndTime} on ${new Date(createAppointmentDto.meeting_date).toISOString().slice(0, 10)}. 
           Please choose different time slot`,
        );
      }
    }
    // Check treatment clash
    try {
      var treatmentList = await this.prismaService.treatments.findMany({
        where: {
          treatment_date: new Date(createAppointmentDto.meeting_date),
          doctor_id: createAppointmentDto.s_id,
        },
      });
    } catch (error) {
      throw new Error('Appointment fetch data error');
    }

    for (let treatment of treatmentList) {
      const existStartTime: String = new Date(treatment.start_time)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      const existEndTime: String = new Date(treatment.end_time)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      // Check if the new appointment's time overlaps with any existing appointment
      if (
        (startTime >= existStartTime && startTime < existEndTime) || // Starts during an existing appointment
        (endTime > existStartTime && endTime <= existEndTime) || // Ends during an existing appointment
        (startTime <= existStartTime && endTime >= existEndTime) // Completely overlaps an existing appointment
      ) {
        throw new ConflictException(
          `Treatment clash detected from ${startTime} to ${endTime}. This staff already have
           another treatment from ${existStartTime} to ${existEndTime} on ${new Date(createAppointmentDto.meeting_date).toISOString().slice(0, 10)}. 
           Please choose different time slot`,
        );
      }
    }

    // Convert date, start time, end time to Date format
    createAppointmentDto.meeting_date = new Date(
      createAppointmentDto.meeting_date,
    );
    createAppointmentDto.start_time = new Date(
      `${meeting_date}T${createAppointmentDto.start_time}Z`,
    );
    createAppointmentDto.end_time = new Date(
      `${meeting_date}T${createAppointmentDto.end_time}Z`,
    );
    const appointment = await this.prismaService.appointments.create({
      data: createAppointmentDto,
      select: {
        meeting_date: true,
        purpose: true,
        start_time: true,
        end_time: true,
        location: true,
        meeting_status: true,
        p_id: true,
        s_id: true,
        staff: {
          select: {
            users: {
              select: {
                Fname: true,
              },
            },
          },
        },
      },
    });

    return {
      data: appointment,
      status: 201,
      message: `Successfully book an new appointment on ${meeting_date} from ${startTime} to ${endTime}`,
    };
  }

  async findAll() {
    return await this.prismaService.appointments.findMany();
  }

  async cancel(updateAppointmentDto: UpdateAppointmentDto) {
    const isExist = await this.prismaService.appointments.findUnique({
      where: {
        appointment_id: updateAppointmentDto.id,
      },
    });

    if (isExist) {
      const cancelAppointment = await this.prismaService.appointments.update({
        where: {
          appointment_id: updateAppointmentDto.id,
        },
        data: {
          meeting_status: false,
        },
      });
      return `Successfully cancel appointment with id ${updateAppointmentDto.id}`;
    } else {
      throw new BadRequestException('Invalid User ID');
    }
  }

  async findByPatientId(id: number) {
    const isExist = await this.prismaService.patients.findUnique({
      where: {
        p_id: id,
      },
    });
    if (isExist) {
      return await this.prismaService.appointments.findMany({
        where: {
          p_id: id,
        },
        select: {
          appointment_id: true,
          meeting_date: true,
          p_id: true,
          s_id: true,
          purpose: true,
          start_time: true,
          end_time: true,
          location: true,
          meeting_status: true,
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

  // data = await this.prisma.patients.findMany({
  //   where: whereClause, // Apply search conditions only if `name` is provided
  //   select: {
  //     p_id: true, // Select specific fields from patients
  //     users: {
  //       select: {
  //         id: true,
  //         username: true,
  //         Fname: true,
  //         Minit: true,
  //         Lname: true,
  //         phone: true,
  //         email: true,
  //         sex: true,
  //         birth_date: true,
  //         pw: false, // Ensure that pw is not selected
  //       },
  //     },
  //   },
  // });

  async findByStaffId(id: number) {
    const isExist = await this.prismaService.staff.findUnique({
      where: {
        s_id: id,
      },
    });
    if (isExist) {
      return await this.prismaService.appointments.findMany({
        where: {
          s_id: id,
        },
      });
    } else {
      throw new BadRequestException('Invalid Staff ID');
    }
  }

  async findAppointmentsByDateRange(s_id: number, meeting_date : Date): Promise<appointments[]> {
    try {
      console.log("meeting_date: ", meeting_date);
      const appointments = await this.prismaService.appointments.findMany({
        where: {
          s_id: s_id,
          meeting_date: meeting_date,
        },
      });
      return appointments;
    } catch (error) {
      throw new Error(`Failed to retrieve treatments within the date range: ${error.message}`);
    }
  }
}
