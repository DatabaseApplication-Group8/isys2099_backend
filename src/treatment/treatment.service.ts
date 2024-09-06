import { GetTreatmentDto } from './dto/get-treatment.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
    const startTime: string = new Date(createTreatmentDto.start_time)
      .toISOString()
      .split('T')[1]
      .split('.')[0];
    const endTime: string = new Date(createTreatmentDto.end_time)
      .toISOString()
      .split('T')[1]
      .split('.')[0];

    // Check treatment clash
    try {
      var treatmentList = await this.prisma.treatments.findMany({
        where: {
          treatment_date: new Date(createTreatmentDto.treatment_date),
          doctor_id: createTreatmentDto.doctor_id,
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

      if (
        treatment.doctor_id === createTreatmentDto.doctor_id &&
        treatment.p_id === createTreatmentDto.p_id
      ) {
        throw new ConflictException(
          `You already have another treatment with this Doctor on ${createTreatmentDto.treatment_date.toISOString().slice(0, 10)} from ${existStartTime} to ${existEndTime}.`,
        );
      }

      if (
        (startTime >= existStartTime && startTime < existEndTime) || // Starts during an existing appointment
        (endTime > existStartTime && endTime <= existEndTime) || // Ends during an existing appointment
        (startTime <= existStartTime && endTime >= existEndTime) // Completely overlaps an existing appointment
      ) {
        throw new ConflictException(
          `Treatment clash detected from ${startTime} to ${endTime}. This staff already have
           another treatment from ${existStartTime} to ${existEndTime} on ${createTreatmentDto.treatment_date.toISOString().slice(0, 10)}. 
           Please choose different time slot`,
        );
      }
    }

    // Check schedule clash
    try {
      var scheduleList = await this.prisma.schedules.findMany({
        where: {
          scheduled_date: new Date(createTreatmentDto.treatment_date),
          s_id: createTreatmentDto.doctor_id,
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
           schedule from ${existStartTime} to ${existEndTime} on ${createTreatmentDto.treatment_date.toISOString().slice(0, 10)}. Please choose different time slot`,
        );
      }
    }

    // Check appointment clash
    try {
      var appointmentList = await this.prisma.appointments.findMany({
        where: {
          meeting_date: new Date(createTreatmentDto.treatment_date),
          s_id: createTreatmentDto.doctor_id,
        },
      });
    } catch (error) {
      throw new Error('Treatment fetch data error');
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
        if (
          (startTime >= existStartTime && startTime < existEndTime) ||
          (endTime > existStartTime && endTime <= existEndTime) ||
          (startTime <= existStartTime && endTime >= existEndTime)
        ) {
          throw new ConflictException(
            `Appointment clash detected from ${startTime} to ${endTime}. This staff already have
           another appointment from ${existStartTime} to ${existEndTime} on ${createTreatmentDto.treatment_date.toISOString().slice(0, 10)}. Please choose different time slot`,
          );
        }
      }
    }
    const billing = (): number => {
      let startHour: number = parseInt(startTime.slice(0, 2));
      let startMinute: number = parseInt(startTime.slice(3, 5));
      let endHour: number = parseInt(endTime.slice(0, 2));
      let endMinute: number = parseInt(endTime.slice(3, 5));

      const startTotalHours: number = startHour + startMinute / 60;
      const endTotalHours: number = endHour + endMinute / 60;

      let totalHour = endTotalHours - startTotalHours;
      totalHour = Math.floor(totalHour);

      return totalHour <= 1 ? 5 : totalHour * 5;
    };
    createTreatmentDto.billing = billing();

    const newTreatment = await this.prisma.treatments.create({
      data: createTreatmentDto,
      select: {
        t_id: true,
        p_id: true,
        doctor_id: true,
        description: true,
        treatment_date: true,
        start_time: true,
        end_time: true,
        billing: true,
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
          billing: true,
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

  async findByPatientIdInGivenDuration(getTreatmentDto: GetTreatmentDto) {
    const isExist = await this.prisma.patients.findUnique({
      where: {
        p_id: +getTreatmentDto.p_id,
      },
    });
    if (isExist) {
      return await this.prisma.treatments.findMany({
        where: {
          p_id: +getTreatmentDto.p_id,
          treatment_date: {
            gte: new Date(getTreatmentDto.start_date),
            lte: new Date(getTreatmentDto.end_date),
          },
        },
        select: {
          t_id: true,
          p_id: true,
          doctor_id: true,
          description: true,
          treatment_date: true,
          start_time: true,
          end_time: true,
          billing: true,
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
}
