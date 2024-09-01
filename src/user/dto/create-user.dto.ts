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
  p_id?: number;
  address?: string;
  allergies?: string;
}
