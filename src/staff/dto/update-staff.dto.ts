import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';
import { Decimal } from '@prisma/client/runtime/library';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
    // s_id : number;
    // job_id : number;
    // dept_id : number;
    // manager_id : number;
    qualifications : string;
    salary : Decimal;
}
