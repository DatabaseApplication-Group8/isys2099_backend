import { UUID } from "crypto";

export class CreateStaffDto {
    s_id : UUID | number;
    job_id : UUID | number;
    dept_id : UUID | number;
    manager_id : UUID | number;
    qualifications : string;
    salary : number;
}
