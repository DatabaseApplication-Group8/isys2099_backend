import { UUID } from 'crypto';
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
  s_id?: UUID | number;
  job_id?: UUID | number;
  dept_id?: UUID | number;
  manager_id?: UUID | number;
  qualifications?: string;
  salary?: number;
}
