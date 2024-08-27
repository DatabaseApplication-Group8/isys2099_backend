import { PrismaService } from './../../prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Prisma } from '@prisma/client';

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
        throw new HttpException(
          `You already have another appointment with this staff on ${meeting_date} from ${startTime} to ${endTime}.`,
          HttpStatus.CONFLICT,
        );
      }
      // Check if the new appointment's time overlaps with any existing appointment
      if (
        (startTime >= existStartTime && startTime < existEndTime) || // Starts during an existing appointment
        (endTime > existStartTime && endTime <= existEndTime) || // Ends during an existing appointment
        (startTime <= existStartTime && endTime >= existEndTime) // Completely overlaps an existing appointment
      ) {
        throw new HttpException(
          'Appointment clash detected. Please choose a different time slot.',
          HttpStatus.CONFLICT,
        );
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
        throw new HttpException(
          'Schedule clash detected. Please choose a different time slot.',
          HttpStatus.CONFLICT,
        );
      }
    }
    // Check Treatment clash


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
}
