import { PrismaService } from './../../prisma/prisma.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { job_history, Prisma } from '@prisma/client';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { CreateJobsHistoryDto } from './dto/create-jobs-history';
import { create } from 'domain';

@Injectable()
export class JobsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
        try {
            return await this.prismaService.jobs.findMany();
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }   

    
    // async addNewJobsHistory(createJobsHistoryDto: CreateJobsHistoryDto) {
    //     const { s_id, job_id } = createJobsHistoryDto;
    //     try {
    //         return await this.prismaService.$transaction(async (prisma) => {
    //             // First, deactivate existing active job histories for the same s_id and job_id
    //             await prisma.job_history.updateMany({
    //                 where: {
    //                     s_id: s_id,
    //                     job_id: job_id,
    //                     job_status: true // targeting only active jobs
    //                 },
    //                 data: {
    //                     job_status: false
    //                 }
    //             });
    
    //             // Now, create a new job history as there will be no active job history with the same s_id and job_id
    //             const newJobHistory = await prisma.job_history.create({
    //                 data: {
    //                     s_id: createJobsHistoryDto.s_id,
    //                     job_id: createJobsHistoryDto.job_id,
    //                     start_date: new Date(), // Sets the start date to the current date
    //                     job_status: true
    //                 },
    //             });
    
    //             return newJobHistory;
    //         });
    //     } catch (e) {
    //         throw new BadRequestException(e.message);
    //     }
    // }
    async addNewJobsHistory(createJobsHistoryDto: CreateJobsHistoryDto) {
        const { s_id, job_id } = createJobsHistoryDto;
        try {
            return await this.prismaService.$transaction(async (prisma) => {
                // Check for existing active job histories
                const existingActiveJob = await prisma.job_history.findFirst({
                    where: {
                        s_id,
                        job_id,
                        job_status: true
                    }
                });
                console.log('s_id and job_id:', createJobsHistoryDto.s_id, createJobsHistoryDto.job_id);
                // If an active job history exists, update it to inactive
                if (existingActiveJob) {
                    await prisma.job_history.updateMany({
                        where: {
                            s_id,
                            job_id,
                            job_status: true
                        },
                        data: {
                            job_status: false
                        }
                    });
                }
    
                // Create a new job history if no active job was found
                const newJobHistory = await prisma.job_history.create({
                    data: {
                        s_id,
                        job_id,
                        start_date: new Date(), // Sets the start date to the current date
                        job_status: true
                    },
                });
    
                return newJobHistory;
            });
        } catch (e) {
            console.error('Error in addNewJobsHistory:', e);
            throw new BadRequestException(e.message);
        }
    }

    async findJobHistoryByStaffId(s_id: number) {
        try {
            return await this.prismaService.job_history.findMany({
                where: {
                    s_id: s_id
                },
                include: {
                    jobs: true // This assumes the relation name is `jobs` in your Prisma model.
                }
            });
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

}