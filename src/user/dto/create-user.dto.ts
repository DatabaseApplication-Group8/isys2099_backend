import { Decimal } from "@prisma/client/runtime/library";

export class CreateUserDto {
  username: string;
  pw: string;
  Fname: string;
  Minit?: string | null;
  Lname: string;
  phone: string;
  email: string;
  sex?: string | null;
  birth_date?: Date | string | null;
  roles: number;
  //patient
  p_id?: number;
  address?: string;
  allergies?: string;
  //staff
  s_id?: number;
  job_id?: number;
  dept_id?: number;
  manager_id?: number;
  qualifications?: string;
  salary?: Decimal;
}
