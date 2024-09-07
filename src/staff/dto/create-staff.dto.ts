import { Decimal } from "@prisma/client/runtime/library";

export class CreateStaffDto {
    s_id : number;
    job_id : number;
    dept_id : number;
    manager_id : number;
    qualifications : string;
    salary : Decimal;
}
